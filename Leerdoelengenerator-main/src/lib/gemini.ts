import axios from 'axios';
import { parseAIResponse } from '@/utils/aiResponse';

const GEMINI_ROUTE = '/api/gemini';

export async function askGeminiFlash(prompt: string): Promise<string> {
  try {
    const response = await axios.post(GEMINI_ROUTE, { prompt });

    const data = response.data;
    if (typeof data?.text === 'string' && data.text.trim()) {
      return data.text;
    }
    return parseAIResponse(data?.data ?? data);
  } catch (err: any) {
    console.error("[Gemini] Axios error:", err);
    throw new Error(err.response?.data?.error || err.message || "Gemini request failed");
  }
}
