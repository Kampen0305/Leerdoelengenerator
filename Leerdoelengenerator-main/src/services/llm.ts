import type { GeminiResponse } from './gemini';

export interface LLMRequest {
  original: string;
  education: string;
  level: string;
  domain: string;
  assessment?: string;
}

export interface LLMResult {
  data: GeminiResponse;
  autoFixed: boolean;
}

export function tryFixJson(input: string): Record<string, unknown> | null {
  const cleaned = input
    .replace(/```json\s*|```/gi, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start !== -1 && end !== -1) {
      try {
        return JSON.parse(cleaned.slice(start, end + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}

const TIMEOUT_MS = 20000;

export async function callLLM(payload: LLMRequest, timeoutMs = TIMEOUT_MS): Promise<LLMResult> {
  if (!payload.original.trim() || !payload.education.trim() || !payload.level.trim() || !payload.domain.trim()) {
    throw new Error('Vul alle verplichte velden in.');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch('/api/llm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const text = await res.text();
    clearTimeout(timeout);

    let autoFixed = false;
    let json: unknown;

    try {
      json = JSON.parse(text);
    } catch {
      const fixed = tryFixJson(text);
      if (fixed) {
        json = fixed;
        autoFixed = true;
      } else {
        throw new Error('Kon antwoord van AI niet verwerken.');
      }
    }

    const obj = json as Record<string, unknown>;
    const data: GeminiResponse = {
      newObjective: String(obj.newObjective ?? ''),
      rationale: String(obj.rationale ?? ''),
      activities: Array.isArray(obj.activities) ? (obj.activities as unknown[]).map(String) : [],
      assessments: Array.isArray(obj.assessments) ? (obj.assessments as unknown[]).map(String) : [],
    };

    return { data, autoFixed };
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('De aanvraag duurde te lang. Probeer korter origineel leerdoel.');
    }
    throw err instanceof Error ? err : new Error(String(err));
  }
}
