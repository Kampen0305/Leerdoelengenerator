// app/api/gemini-generate/route.ts
// Forceer Node runtime (Edge kan crashen -> 502)
export const runtime = 'nodejs';

const ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

// Korte guard tegen te grote prompts (anders 400 upstream)
function trimToMaxChars(text: string, max = 120_000) {
  return text && text.length > max ? text.slice(0, max) : text;
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Missing GEMINI_API_KEY' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json().catch(() => ({}));
    let prompt: string = body?.prompt ?? 'Health check: zeg “OK”.';
    prompt = trimToMaxChars(prompt);

    const payload: any = {
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    };

    if (body?.system) {
      payload.systemInstruction = {
        role: 'system',
        parts: [{ text: String(body.system) }],
      };
    }

    const r = await fetch(`${ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const upstreamText = await r.text();
    // Belangrijk: GEEN 502 meer retourneren. We geven altijd 200 terug met ok:false + details.
    if (!r.ok) {
      return new Response(
        JSON.stringify({
          ok: false,
          upstreamStatus: r.status,
          upstream: upstreamText.slice(0, 2000),
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = JSON.parse(upstreamText);
    return new Response(JSON.stringify({ ok: true, data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    // Ook hier: nooit 502 naar buiten
    return new Response(
      JSON.stringify({
        ok: false,
        error: 'Route crashed',
        detail: e?.message ?? String(e),
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
