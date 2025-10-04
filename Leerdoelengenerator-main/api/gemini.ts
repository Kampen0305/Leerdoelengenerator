import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { parseAIResponse } from '../src/utils/aiResponse';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Compatibiliteit: lees GEMINI_API_KEY, val desnoods terug op VITE_GEMINI_API_KEY (server-side only)
  const key = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!key) {
    console.error('[gemini] Missing server env: GEMINI_API_KEY (or VITE_GEMINI_API_KEY)');
    return res.status(500).json({ error: 'GEMINI_API_KEY is missing on server' });
  }

  try {
    const { prompt, generationConfig } = (req.body ?? {}) as {
      prompt?: string;
      generationConfig?: Record<string, unknown>;
    };
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Missing "prompt" (string)' });
    }

    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
        ...generationConfig,
      },
    });

    const text = parseAIResponse(result?.response ?? result);
    return res.status(200).json({ text });
  } catch (err: any) {
    console.error('[gemini] error:', err?.message || err);
    return res.status(500).json({ error: 'Gemini request failed' });
  }
}
