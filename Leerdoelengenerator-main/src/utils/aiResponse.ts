export function parseAIResponse(response: unknown): string {
  console.log("AI API response:", response);

  if (!response) return "⚠️ Geen antwoord ontvangen van AI.";

  if (typeof response === "object" && response !== null) {
    const maybeChoices = (response as any).choices;
    if (Array.isArray(maybeChoices) && maybeChoices.length > 0) {
      return (
        maybeChoices[0]?.message?.content || "⚠️ Leeg antwoord (OpenAI)."
      );
    }
  }

  if (typeof response === "object" && response !== null) {
    const candidates = (response as any).candidates;
    if (Array.isArray(candidates) && candidates.length > 0) {
      const firstCandidate = candidates[0];
      const parts = firstCandidate?.content?.parts;
      if (Array.isArray(parts) && parts.length > 0) {
        const firstPart = parts[0];
        if (
          firstPart &&
          typeof firstPart.text === "string" &&
          firstPart.text.trim()
        ) {
          return firstPart.text;
        }
      }
      if (
        typeof firstCandidate?.text === "string" &&
        firstCandidate.text.trim()
      ) {
        return firstCandidate.text;
      }
      return "⚠️ Leeg antwoord (Gemini).";
    }
  }

  if (
    typeof response === "object" &&
    response !== null &&
    typeof (response as any).text === "function"
  ) {
    try {
      const value = (response as any).text();
      if (typeof value === "string" && value.trim()) {
        return value;
      }
    } catch (error) {
      console.error("Fout bij aanroepen van response.text():", error);
    }
  } else if (
    typeof response === "object" &&
    response !== null &&
    typeof (response as any).text === "string" &&
    (response as any).text.trim()
  ) {
    return (response as any).text;
  }

  console.error("Onbekend AI-responseformaat:", response);
  return "⚠️ Onbekende AI-response structuur.";
}
