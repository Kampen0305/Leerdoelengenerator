"use client";
import { useState } from "react";
import { sendFeedback } from "../utils/feedback";

export default function StarFeedback() {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [comment, setComment] = useState<string>("");
  const [stars, setStars] = useState<number>(5);

  async function submitFeedback() {
    setSending(true);
    setError(null);
    setSuccess(false);
    try {
      await sendFeedback({
        rating: stars,
        comment: (comment ?? '').trim() || undefined,
        page: typeof window !== 'undefined' ? window.location.pathname : undefined,
        ua: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      });

      setSuccess(true);
      setComment("");
    } catch (e: any) {
      setError(e?.message || "Er is iets misgegaan");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mt-4 border-t pt-3">
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            aria-label={`${n} sterren`}
            onClick={() => setStars(n)}
            className={`text-2xl ${n <= stars ? "text-yellow-500" : "text-gray-300"} hover:scale-110`}
          >
            ★
          </button>
        ))}
        <span className="text-sm text-gray-600">
          {stars ? `${stars}/5` : "Beoordeel dit resultaat"}
        </span>
      </div>

      <textarea
        className="mt-2 w-full rounded border p-2 text-sm"
        placeholder="(optioneel) licht je beoordeling toe…"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        maxLength={1000}
      />

      <button
        onClick={submitFeedback}
        disabled={sending}
        className="mt-2 rounded bg-black px-3 py-2 text-white disabled:opacity-50"
      >
        {sending ? "Versturen…" : "Verstuur feedback"}
      </button>

      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-600">Bedankt! Je feedback is verzonden.</p>}
    </div>
  );
}

