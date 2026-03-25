import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) {
    console.error('[API] GROQ_API_KEY is not set in environment variables');
    return res.status(500).json({ error: 'Server misconfiguration: API key missing' });
  }

  try {
    const { messages, temperature = 0, response_format } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Missing or invalid "messages" array in request body' });
    }

    const body: Record<string, unknown> = {
      model: 'llama-3.3-70b-versatile',
      messages,
      temperature,
    };

    // Only include response_format if provided (for JSON mode)
    if (response_format) {
      body.response_format = response_format;
    }

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error('[API] Groq returned error:', groqResponse.status, errorText);
      return res.status(groqResponse.status).json({ error: `Groq API error: ${groqResponse.status}` });
    }

    const data = await groqResponse.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('[API] Groq proxy error:', error);
    return res.status(500).json({ error: 'Internal server error during LLM request' });
  }
}
