// services/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const MODEL = process.env.GEMINI_MODEL_ID || "gemini-1.5-flash";

function assertEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`[Gemini] Missing env ${name}`);
  return v;
}

export function getGeminiModel() {
  const apiKey = assertEnv("GOOGLE_API_KEY");
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: MODEL });
  console.info("[AI-check] Gemini online met model:", MODEL);
  return model;
}

export async function generateText(prompt: string) {
  const model = getGeminiModel();
  const res = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }]}],
  });
  return res.response.text();
}
