// api/gemini.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is missing on server' });
  }

  try {
    const { prompt } = (req.body ?? {}) as { prompt?: string };
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Missing prompt' });
    }

    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const result = await model.generateContent(prompt);
    const text = result?.response?.text?.() ?? '';

    return res.status(200).json({ text });
  } catch (err: any) {
    console.error('[gemini] error:', err?.message || err);
    return res.status(500).json({ error: 'Gemini request failed' });
  }
}
