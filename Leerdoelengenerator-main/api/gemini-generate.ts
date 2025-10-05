// api/gemini-generate.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { parseAIResponse } from '../src/utils/aiResponse';

const ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.status(200).json({ ok: false, error: 'Missing GEMINI_API_KEY' });
      return;
    }

    const prompt = (req.body?.prompt as string) ?? 'Health check: zeg “OK”.';

    // Minimal payload voor Gemini REST API
    const payload = {
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    };

    const r = await fetch(`${ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const upstreamText = await r.text();

    // Belangrijk: nooit 502 teruggeven; toon upstream status en message
    if (!r.ok) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.status(200).json({
        ok: false,
        upstreamStatus: r.status,
        upstream: upstreamText.slice(0, 2000),
      });
      return;
    }

    const data = JSON.parse(upstreamText);
    const text = parseAIResponse((data as any)?.response ?? data);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json({ ok: true, data, text });
  } catch (err: any) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json({
      ok: false,
      error: 'Route crashed',
      detail: String(err?.message ?? err),
    });
  }
}
