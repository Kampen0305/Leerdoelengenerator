// Forceer Node-runtime om Edge-issues te vermijden
export const runtime = 'nodejs';

const ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ ok: false, error: 'Missing GEMINI_API_KEY' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json().catch(() => ({}));
    const prompt: string = body?.prompt ?? 'Health check: zeg “OK”.';
    const payload = { contents: [{ role: 'user', parts: [{ text: prompt }] }] };

    const r = await fetch(`${ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const upstreamText = await r.text();
    if (!r.ok) {
      return new Response(
        JSON.stringify({ ok: false, upstreamStatus: r.status, upstream: upstreamText.slice(0, 2000) }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = JSON.parse(upstreamText);
    console.log('Gemini response:', data);
    return new Response(JSON.stringify({ ok: true, data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: 'Route crashed', detail: String(e) }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
