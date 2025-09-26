import type { VercelRequest, VercelResponse } from "@vercel/node";

// Lees zowel server-only als bestaande VITE_* namen
const API_KEY =
  process.env.GOOGLE_API_KEY ||
  process.env.GEMINI_API_KEY ||
  process.env.VITE_GEMINI_API_KEY;

const MODEL_ID =
  process.env.GEMINI_MODEL_ID ||
  process.env.VITE_GEMINI_MODEL ||
  "gemini-1.5-flash";

// Kleine healthcheck via GET, genereren via POST
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === "GET" && "ping" in (req.query || {})) {
      return res.status(200).json({
        ok: true,
        runtime: "nodejs",
        hasKey: Boolean(API_KEY),
        model: MODEL_ID,
        env: process.env.VERCEL_ENV || process.env.NODE_ENV || "unknown",
      });
    }

    if (req.method !== "POST") {
      res.setHeader("Allow", "POST, GET");
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    if (!API_KEY) {
      return res.status(500).json({ error: "Missing Gemini API key on server" });
    }

    const prompt =
      (req.body && (req.body.prompt as string)) ||
      (req.query && (req.query.prompt as string));

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: "Missing prompt" });
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

    const data = await upstream.json().catch(() => ({} as any));

    if (!upstream.ok) {
      return res.status(502).json({
        error: "Upstream Gemini error",
        status: upstream.status,
        details: data?.error || data || null,
      });
    }

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      data?.candidates?.[0]?.content?.parts?.[0]?.inline_data?.data ??
      "";

    return res.status(200).json({ text, model: MODEL_ID, provider: "ai-studio" });
  } catch (e: any) {
    return res
      .status(500)
      .json({ error: "Server error", details: e?.message || String(e) });
  }
}
