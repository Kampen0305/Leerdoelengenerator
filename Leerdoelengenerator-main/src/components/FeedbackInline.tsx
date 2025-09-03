// components/FeedbackInline.tsx
"use client";

import { useState } from "react";

type Props = {
  defaultStars?: number;
  path?: string;
};

export default function FeedbackInline({ defaultStars = 5, path }: Props) {
  const [stars, setStars] = useState<number>(defaultStars);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function submitFeedback() {
    setSending(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stars,
          comment,
          path: path ?? (typeof window !== "undefined" ? window.location.pathname : ""),
          ua: typeof navigator !== "undefined" ? navigator.userAgent : "",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      setSuccess(true);
      setComment("");
    } catch (e: any) {
      setError(e?.message || "Er is iets misgegaan");
    } finally {
      setSending(false);
    }
  }

  return (
    <section
      aria-labelledby="feedback-title"
      className="mt-6 rounded-xl border border-neutral-200 bg-white/60 p-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/40 dark:border-neutral-800 dark:bg-neutral-900/60"
    >
      <h3 id="feedback-title" className="mb-2 text-sm font-semibold text-neutral-700 dark:text-neutral-200">
        Hoe beoordeel je deze gegenereerde leerdoelen?
      </h3>

      {/* Stars */}
      <div className="mb-2 flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            aria-label={`${i} ster`}
            onClick={() => setStars(i)}
            className="text-2xl leading-none"
            title={`${i}/5`}
          >
            {i <= stars ? "★" : "☆"}
          </button>
        ))}
        <span className="ml-2 text-sm text-neutral-500">{stars}/5</span>
      </div>

      {/* Comment */}
      <label className="block text-xs text-neutral-500 dark:text-neutral-400 mb-1">
        (optioneel) licht je beoordeling toe…
      </label>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        className="w-full resize-y rounded-lg border border-neutral-300 bg-white p-2 text-sm outline-none focus:ring-2 focus:ring-black/10 dark:border-neutral-700 dark:bg-neutral-900"
      />

      {/* Actions / Messages */}
      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={submitFeedback}
          disabled={sending}
          className="rounded-lg bg-black px-4 py-2 text-white disabled:opacity-60 dark:bg-white dark:text-black"
        >
          {sending ? "Versturen…" : "Verstuur feedback"}
        </button>
        {error && <p className="text-sm text-red-600">⚠ {error}</p>}
        {success && <p className="text-sm text-green-600">Bedankt! Je feedback is verzonden.</p>}
      </div>
    </section>
  );
}

