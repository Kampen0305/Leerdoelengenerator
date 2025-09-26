export const runtime = 'edge';

const ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

// simpele guard om te grote prompts te voorkomen (anders 400 van Google)
function trimToMaxChars(text: string, max = 120_000) {
  return text && text.length > max ? text.slice(0, max) : text;
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Missing GEMINI_API_KEY' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
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

    if (!r.ok) {
      return new Response(
        JSON.stringify({
          ok: false,
          status: r.status,
          upstream: upstreamText.slice(0, 2000),
        }),
        { status: r.status, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const data = JSON.parse(upstreamText);
    return new Response(JSON.stringify({ ok: true, data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    return new Response(
      JSON.stringify({ ok: false, error: 'Route crashed', detail: e?.message ?? String(e) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}
