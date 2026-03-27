/// <reference types="vite/client" />
import { UserProfile } from '../types';

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
): Promise<{ type: string; severity: 'high' | 'medium' | 'low'; intent: string; tags: string[]; confidence: number; reasonRisky: string; reasonSafe: string; originalLanguage: string } | null> {
  const systemPrompt = `You are an intelligent workplace scenario classifier & AI translator.
The user may provide input in English, Hindi, or Punjabi.

Return ONLY valid JSON:
{
  "type": "...",
  "severity": "...",
  "intent": "...",
  "tags": ["..."],
  "confidence": 0-100,
  "reason_risky": "...",
  "reason_safe": "...",
  "originalLanguage": "English|Hindi|Punjabi"
}

CLASSIFICATION LOGIC (classify based on meaning, translated internally to English logic):

1. If input involves threats (job loss, visa issues, punishment), coercion, or pressure:
   → type: "workplace_pressure", severity: "high"

2. If input involves unpaid work or forced overtime:
   → type: "overtime", severity: "high"

3. If input involves inappropriate behavior, harassment (verbal, physical, emotional):
   → type: "harassment", severity: "high"

4. If input involves verbal or physical abuse, passport confiscation, or violence:
   → type: "abuse", severity: "high"

5. If input involves salary delays or missing payments:
   → type: "salary_delay", severity: "high"

IF THE INPUT IS NONSENSE, IRRELEVANT, OR LACKS WORKPLACE CONTEXT (e.g., "I am sad", "123456", "Hello"):
- Return type: "unclear_instruction"
- reason_risky: "This input does not seem to describe a workplace situation I can analyze."
- reason_safe: "Please describe your workplace concern in more detail."

PRIORITY RULE: If multiple issues exist, choose the MOST severe one.
Priority order: harassment > abuse > workplace_pressure > overtime > salary_delay > unclear_instruction
CRITICAL: DO NOT classify serious issues as "unclear_instruction".

Valid types: harassment, abuse, overtime, salary_delay, workplace_pressure, unclear_instruction
Valid severities: low, medium, high
Valid intents: reporting_issue, asking_help, confusion, escalation

NEW FIELDS TO GENERATE:
- "tags": Array of 1 to 3 semantic English keywords (e.g. ["unpaid_work", "pressure", "visa"]).
- "confidence": Integer 0 to 100 based on input clarity.
- "reason_risky": 1-sentence explanation of why this situation poses a risk. MUST be in the same language the user spoke (e.g., Hindi if they used Hindi). Use a professional but empathetic tone.
- "reason_safe": 1-sentence explaining the safest mitigation approach. MUST be in the same language the user spoke.
- "originalLanguage": The detected language (English, Hindi, or Punjabi).

Output ONLY the JSON object. No markdown.`;

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
        tags: Array.isArray(parsed.tags) ? parsed.tags : ['general'],
        confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 80,
        reasonRisky: parsed.reason_risky || 'This situation carries potential legal or workplace risks.',
        reasonSafe: parsed.reason_safe || 'Proceed with documented legal caution.',
        originalLanguage: parsed.originalLanguage || 'English'
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
  // Guard: empty or too short input
  if (!situation || situation.trim().length < 3) {
    return 'Please describe the situation in more detail so I can explain it.';
  }

  try {
    console.log('[EXPLAIN] Calling Groq with situation:', situation);
    const data = await callGroq(
      [
        {
          role: 'system',
          content: 'You are an empathetic but objective workplace analyst. Explain the situation clearly without giving direct advice or suggesting actions. Focus on what is happening and how it relates to general workplace standards. Keep it under 3 sentences.',
        },
        {
          role: 'user',
          content: `Explain this workplace situation in simple terms: "${situation}"`,
        },
      ],
      { temperature: 0.2 }
    );

    console.log('[EXPLAIN] RESPONSE:', JSON.stringify(data));
    const content = data?.choices?.[0]?.message?.content;
    return content || 'The situation involves a workplace concern that may require careful handling based on your dependency level.';
  } catch (err) {
    console.error('[EXPLAIN] Error:', err);
    return 'This situation involves a workplace concern. Use the decision matrix above for safe next steps.';
  }
}

// ── FOLLOW-UP LAYER (read-only, no decisions) ───────────────────────
export async function callLLMForFollowup(question: string, context: string, profile: Partial<UserProfile> = {}): Promise<string> {
  // Guard: empty or too short input
  if (!question || question.trim().length < 3) {
    return 'Please describe your question in a bit more detail.';
  }

  try {
    const profileSummary = `User Profile: Dependency: ${profile.dependencyLevel}, Financial Pressure: ${profile.financialPressure}, Visa: ${profile.visaType}.`;
    
    console.log('[CHAT] Calling Groq with question:', question);
    const data = await callGroq(
      [
        {
          role: 'system',
          content: 'You are an objective workplace analyst. Answer by explaining risks, clarifying concepts, or describing consequences. Take into account the user\'s profile context when relevant (e.g., how dependency affects their options). Do NOT give direct decision advice. Keep it factual and under 3 sentences.',
        },
        {
          role: 'user',
          content: `${profileSummary}\n\nSituation Context: "${context}"\n\nQuestion: ${question}`,
        },
      ],
      { temperature: 0.2 }
    );

    console.log('[CHAT] RESPONSE:', JSON.stringify(data));
    const content = data?.choices?.[0]?.message?.content;
    return content || 'Sorry, I couldn\'t process that. Please try rephrasing your question.';
  } catch (err) {
    console.error('[CHAT] Error:', err);
    return 'Something went wrong processing your question. Please try again.';
  }
}
