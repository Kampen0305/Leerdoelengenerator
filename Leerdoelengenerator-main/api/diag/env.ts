import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  const key = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  // Geef NOOIT de key terug; alleen veilige metadata
  res.status(200).json({
    geminiKeyPresent: Boolean(key),
    source: process.env.GEMINI_API_KEY
      ? 'GEMINI_API_KEY'
      : process.env.VITE_GEMINI_API_KEY
      ? 'VITE_GEMINI_API_KEY'
      : 'none',
    length: key ? String(key).length : 0,
    tail4: key ? String(key).slice(-4) : null,
  });
}
