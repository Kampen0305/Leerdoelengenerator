// lib/gemini.ts
function apiUrl(path: string) {
  // Ondersteun basePath; zet NEXT_PUBLIC_BASE_PATH gelijk aan basePath in next.config.js (of laat leeg)
  const bp = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return `${bp}/api${path.startsWith('/') ? path : `/${path}`}`;
}

export async function callGemini(prompt: string, system?: string) {
  const res = await fetch(apiUrl('/gemini-generate'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, system }),
  });

  const json = await res.json().catch(() => ({}));

  if (!json?.ok) {
    console.error('[Gemini error]', json);
    const msg = json?.upstream || json?.error || `Gemini call failed`;
    throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
  }

  const parts = json?.data?.candidates?.[0]?.content?.parts ?? [];
  return parts.map((p: any) => p?.text ?? '').join('');
}
