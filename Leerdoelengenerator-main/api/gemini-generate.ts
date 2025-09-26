// api/gemini-generate.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { generateText } from "../services/gemini";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { prompt } = (req.method === "POST" ? req.body : req.query) as { prompt: string };
    if (!prompt) return res.status(400).json({ error: "Missing prompt" });
    const text = await generateText(prompt);
    return res.status(200).json({ text, provider: "ai-studio", model: process.env.GEMINI_MODEL_ID || "gemini-1.5-flash" });
  } catch (e: any) {
    console.error("[Gemini] error", e?.message || e);
    return res.status(500).json({ error: "Gemini failed", detail: e?.message || String(e) });
  }
}
