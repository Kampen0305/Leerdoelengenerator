export const runtime = "edge"; // laat staan voor Edge; verwijder of zet 'nodejs' als je Node runtimes wil

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ ok: false, error: "Missing GEMINI_API_KEY" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // body verwacht: { prompt: string, system?: string }
    const body = await req.json().catch(() => ({}));
    const prompt: string =
      body?.prompt ?? "Schrijf 1 zin: dit is een health-check.";
    const system: string | undefined = body?.system;

    const payload: any = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    };

    if (system) {
      // simpele system-instructie via generative safety-hint
      payload.systemInstruction = { role: "system", parts: [{ text: system }] };
    }

    const googleRes = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await googleRes.text(); // eerst als text voor transparante foutmelding
    if (!googleRes.ok) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: "Upstream Gemini error",
          status: googleRes.status,
          upstream: text,
        }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    // parse na ok
    const data = JSON.parse(text);
    return new Response(JSON.stringify({ ok: true, data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: "Route crashed",
        detail: err?.message ?? String(err),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
