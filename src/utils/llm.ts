/// <reference types="vite/client" />

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';
const BACKEND_ENDPOINT = '/api/llm';

// ── Detect environment ──────────────────────────────────────────────
// In local dev, call Groq directly (key available via VITE_ prefix)
// In production (Vercel), use the backend proxy (key is server-side only)
function isLocalDev(): boolean {
  return !!GROQ_API_KEY;
}

// ── Helper: call Groq (direct or via proxy) ─────────────────────────
async function callGroq(
  messages: { role: string; content: string }[],
  options: { temperature?: number; response_format?: { type: string } } = {}
): Promise<any> {
  const useDirectCall = isLocalDev();

  const url = useDirectCall ? GROQ_ENDPOINT : BACKEND_ENDPOINT;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (useDirectCall) {
    headers['Authorization'] = `Bearer ${GROQ_API_KEY}`;
  }

  const body: Record<string, unknown> = {
    model: GROQ_MODEL,
    messages,
    temperature: options.temperature ?? 0,
  };
  if (options.response_format) {
    body.response_format = options.response_format;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    console.error('[LLM] API error:', response.status, errorText);
    throw new Error(`LLM API returned ${response.status}`);
  }

  return response.json();
}

// ── CORE: Scenario Parser ───────────────────────────────────────────
export async function callLLMForParsing(
  text: string
): Promise<{ type: string; severity: 'high' | 'medium' | 'low'; intent: string } | null> {
  const systemPrompt = `You are a workplace scenario classifier.
Analyze the following employee situation and return ONLY valid JSON.

{
  "type": "<one of: harassment, abuse, overtime, salary_delay, workplace_pressure, unclear_instruction>",
  "severity": "<one of: low, medium, high>",
  "intent": "<one of: reporting_issue, asking_help, confusion, escalation>"
}

Rules:
- "type" must be exactly one of the listed values
- "severity" must be exactly one of: low, medium, high
- "intent" must be exactly one of the listed values
- Output ONLY the JSON object, nothing else
- No markdown, no explanation, no extra text`;

  try {
    const data = await callGroq(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text },
      ],
      { temperature: 0, response_format: { type: 'json_object' } }
    );

    const raw = data.choices?.[0]?.message?.content;
    console.log('[LLM] RAW:', raw);

    try {
      const parsed = JSON.parse(raw);
      console.log('[LLM] PARSED:', parsed);

      const validTypes = ['harassment', 'abuse', 'overtime', 'salary_delay', 'workplace_pressure', 'unclear_instruction'];
      const validSeverities = ['low', 'medium', 'high'];
      const validIntents = ['reporting_issue', 'asking_help', 'confusion', 'escalation'];

      return {
        type: validTypes.includes(parsed.type) ? parsed.type : 'unclear_instruction',
        severity: validSeverities.includes(parsed.severity) ? parsed.severity : 'medium',
        intent: validIntents.includes(parsed.intent) ? parsed.intent : 'confusion',
      };
    } catch (parseErr) {
      console.error('[LLM] JSON parse failed:', parseErr);
      return null;
    }
  } catch (fetchErr) {
    console.error('[LLM] Fetch error:', fetchErr);
    return null;
  }
}

// ── EXPLANATION LAYER (read-only, no decisions) ─────────────────────
export async function callLLMForExplanation(situation: string): Promise<string> {
  try {
    console.log('[EXPLAIN] Calling Groq with situation:', situation);
    const data = await callGroq(
      [
        {
          role: 'system',
          content: 'You are an objective workplace analyst. Do NOT give advice. Do NOT suggest actions. Only explain what is happening objectively. Keep it under 3 sentences.',
        },
        {
          role: 'user',
          content: `Explain this workplace situation in simple, human-friendly terms: "${situation}"`,
        },
      ],
      { temperature: 0.2 }
    );

    console.log('[EXPLAIN] API RESPONSE:', JSON.stringify(data));
    const content = data.choices?.[0]?.message?.content;
    return content || 'No explanation returned.';
  } catch (err) {
    console.error('[EXPLAIN] Error:', err);
    return 'Failed to fetch explanation. Please try again.';
  }
}

// ── FOLLOW-UP LAYER (read-only, no decisions) ───────────────────────
export async function callLLMForFollowup(question: string, context: string): Promise<string> {
  try {
    console.log('[CHAT] Calling Groq with question:', question);
    const data = await callGroq(
      [
        {
          role: 'system',
          content: 'You are an objective workplace analyst. Answer by explaining risks, clarifying concepts, or describing consequences. Do NOT give direct decision advice. Keep it factual and under 3 sentences.',
        },
        {
          role: 'user',
          content: `Context: "${context}"

Question: ${question}`,
        },
      ],
      { temperature: 0.2 }
    );

    console.log('[CHAT] API RESPONSE:', JSON.stringify(data));
    const content = data.choices?.[0]?.message?.content;
    return content || 'No response returned.';
  } catch (err) {
    console.error('[CHAT] Error:', err);
    return 'Failed to fetch response. Please try again.';
  }
}
