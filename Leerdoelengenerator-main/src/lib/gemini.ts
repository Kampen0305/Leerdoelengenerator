// src/lib/gemini.ts
const GEMINI_ROUTE = '/api/gemini';

export async function callGemini(prompt: string) {
  const res = await fetch(GEMINI_ROUTE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });

  let json: any = null;
  try {
    json = await res.json();
  } catch (err) {
    console.error('[Gemini error] Failed to parse JSON response', err);
  }

  if (!res.ok || json?.error) {
    console.error('[Gemini error]', json);
    const statusMsg = `Gemini call failed (status: ${res.status})`;
    const msg = json?.error || statusMsg;
    throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
  }

  const text = typeof json?.text === 'string' ? json.text : '';
  if (!text) {
    throw new Error('Gemini returned an empty response');
  }

  return text;
}
