import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const API_KEY =
  process.env.GOOGLE_API_KEY ||
  process.env.GEMINI_API_KEY ||
  process.env.VITE_GEMINI_API_KEY;

const MODEL_ID =
  process.env.GEMINI_MODEL_ID ||
  process.env.VITE_GEMINI_MODEL ||
  "gemini-1.5-flash";

type GeminiRequestBody = { prompt?: string } | null;

type GeminiContentPart =
  | { text?: string; inline_data?: undefined }
  | { inline_data?: { data?: string }; text?: undefined };

type GeminiCandidate = {
  content?: {
    parts?: GeminiContentPart[];
  };
};

type GeminiResponseBody = {
  candidates?: GeminiCandidate[];
  error?: unknown;
  [key: string]: unknown;
};

export async function POST(req: NextRequest) {
  try {
    if (!API_KEY) {
      return NextResponse.json(
        { error: "Missing Gemini API key on server" },
        { status: 500 }
      );
    }

    const body = (await req
      .json()
      .catch(() => null)) as GeminiRequestBody;
    const prompt = body?.prompt?.toString().trim();

    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    const url = `https://generativelanguage.googleapis.com/v1/models/${MODEL_ID}:generateContent?key=${API_KEY}`;

    const payload = {
      contents: [{ role: "user", parts: [{ text: prompt }]}],
    };

    const upstream = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = (await upstream.json().catch(() => ({}))) as GeminiResponseBody;

    if (!upstream.ok) {
      return NextResponse.json(
        {
          error: "Upstream Gemini error",
          status: upstream.status,
          details: data?.error ?? data,
        },
        { status: 502 }
      );
    }

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      data?.candidates?.[0]?.content?.parts?.[0]?.inline_data?.data ??
      "";

    return NextResponse.json({
      text,
      provider: "ai-studio",
      model: MODEL_ID,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Server error", details: e?.message || String(e) },
      { status: 500 }
    );
  }
}
