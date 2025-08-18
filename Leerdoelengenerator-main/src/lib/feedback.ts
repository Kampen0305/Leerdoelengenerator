export interface FeedbackInput {
  rating: number;
  comment?: string;
}

export interface StoredFeedback extends FeedbackInput {
  user: "anoniem";
  timestamp: string;
}

const STORAGE_KEY = "feedback";

const emailRegex = /[\w.-]+@[\w.-]+\.[A-Za-z]{2,}/;
const phoneRegex = /\b\+?[0-9]{6,}\b/;

function sanitizeComment(comment?: string): string | undefined {
  if (!comment) return undefined;
  const trimmed = comment.trim();
  if (trimmed.length === 0) return undefined;
  if (trimmed.length > 140) {
    return trimmed.slice(0, 140);
  }
  if (emailRegex.test(trimmed) || phoneRegex.test(trimmed)) {
    throw new Error("Geen persoonlijke gegevens a.u.b.");
  }
  return trimmed;
}

export function submitFeedback(input: FeedbackInput): void {
  const rating = Math.min(5, Math.max(1, input.rating));
  const comment = sanitizeComment(input.comment);

  const entry: StoredFeedback = {
    rating,
    comment,
    user: "anoniem",
    timestamp: new Date().toISOString(),
  };

  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    existing.push(entry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch {
    // ignore storage errors
  }

  console.log("Feedback", entry);
}
