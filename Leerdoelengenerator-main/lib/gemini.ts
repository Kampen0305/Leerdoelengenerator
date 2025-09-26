export async function callGemini(prompt: string, system?: string) {
  const res = await fetch('/api/gemini-generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, system }),
  });

  let json: any = null;
  try {
    json = await res.json();
  } catch {
    throw new Error('Kon response niet parsen van /api/gemini-generate');
  }

  if (!res.ok || !json?.ok) {
    console.error('[Gemini error]', { httpStatus: res.status, payload: json });
    const msg =
      json?.upstream ??
      json?.error ??
      `Gemini call failed with HTTP ${res.status}`;
    throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
  }

  const parts = json?.data?.candidates?.[0]?.content?.parts ?? [];
  return parts.map((p: any) => p?.text ?? '').join('');
}
