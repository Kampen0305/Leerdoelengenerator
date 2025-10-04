import { parseAIResponse } from '@/utils/aiResponse';

const GEMINI_ROUTE = '/api/gemini';

export async function askGeminiFlash(prompt: string): Promise<string> {
  const r = await fetch(GEMINI_ROUTE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data?.error || `Gemini route failed (${r.status})`);
  if (typeof data?.text === 'string' && data.text.trim()) {
    return data.text;
  }
  return parseAIResponse(data?.data ?? data);
}
