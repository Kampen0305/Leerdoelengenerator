// lib/gemini.ts
export async function callGemini(prompt: string, system?: string) {
  const res = await fetch('/api/gemini-generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, system }),
  });

  const json = await res.json().catch(() => ({}));

  if (!json?.ok) {
    // Toon nette, bruikbare fout in console/UI i.p.v. 502/Object
    console.error('[Gemini error]', json);
    const msg =
      json?.upstream ??
      json?.error ??
      `Gemini call failed (status: ${json?.upstreamStatus ?? 'unknown'})`;
    throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
  }

  const parts = json?.data?.candidates?.[0]?.content?.parts ?? [];
  return parts.map((p: any) => p?.text ?? '').join('');
}
