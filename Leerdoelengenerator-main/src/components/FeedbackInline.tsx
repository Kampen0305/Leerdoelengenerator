"use client";

import { useMemo, useState } from "react";

type Props = {
  defaultStars?: number;
  path?: string;
  className?: string;
  title?: string;
  buttonLabel?: string;
  placeholder?: string;
};

export default function FeedbackInline({
  defaultStars = 5,
  path,
  className = "",
  title = "Hoe beoordeel je deze gegenereerde leerdoelen?",
  buttonLabel = "Verstuur feedback",
  placeholder = "(optioneel) licht je beoordeling toe…",
}: Props) {
  const [stars, setStars] = useState<number>(defaultStars);
  const [hover, setHover] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const active = hover ?? stars;

  const starButtons = useMemo(
    () =>
      [1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          aria-label={`${i} ster`}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(null)}
          onFocus={() => setHover(i)}
          onBlur={() => setHover(null)}
          onClick={() => setStars(i)}
          className="size-7 md:size-8"
          title={`${i}/5`}
        >
          <Star filled={i <= active} />
        </button>
      )),
    [active]
  );

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
      className={[
        "mt-6 rounded-2xl border p-4 md:p-5 shadow-sm",
        "bg-[var(--brand-card)] border-[var(--brand-border)] text-[var(--brand-text)]",
        "backdrop-blur supports-[backdrop-filter]:bg-[color:var(--brand-card)]",
        className,
      ].join(" ")}
    >
      <h3
        id="feedback-title"
        className="mb-3 text-base md:text-lg font-semibold"
        style={{ color: "var(--brand-text)" }}
      >
        {title}
      </h3>

      {/* Stars */}
      <div className="mb-2 flex items-center gap-1.5">{starButtons}</div>
      <div className="mb-3 text-xs md:text-sm" style={{ color: "var(--brand-muted)" }}>
        {active}/5
      </div>

      {/* Comment */}
      <label className="block text-xs mb-1" style={{ color: "var(--brand-muted)" }}>
        {placeholder}
      </label>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        className="w-full resize-y rounded-xl border bg-transparent p-3 text-sm outline-none focus:ring-2"
        style={{
          borderColor: "var(--brand-border)",
          color: "var(--brand-text)",
          boxShadow: "none",
        }}
      />

      {/* Actions / Messages */}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <button
          onClick={submitFeedback}
          disabled={sending}
          className="rounded-xl px-4 py-2 text-sm font-medium disabled:opacity-60"
          style={{
            background: "var(--brand-btn-bg)",
            color: "var(--brand-btn-text)",
          }}
          onMouseEnter={(e) => ((e.currentTarget.style.background as any) = "var(--brand-btn-bg-hover)")}
          onMouseLeave={(e) => ((e.currentTarget.style.background as any) = "var(--brand-btn-bg)")}
        >
          {sending ? "Versturen…" : buttonLabel}
        </button>

        {error && (
          <p className="text-sm" style={{ color: "var(--brand-error)" }}>
            ⚠ {error}
          </p>
        )}
        {success && (
          <p className="text-sm" style={{ color: "var(--brand-success)" }}>
            Bedankt! Je feedback is verzonden.
          </p>
        )}
      </div>
    </section>
  );
}

/** Gele ster (SVG), vult met --brand-accent bij filled=true */
function Star({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="inline-block"
      aria-hidden="true"
      style={{ fill: filled ? "var(--brand-accent)" : "transparent", stroke: "var(--brand-accent)" }}
    >
      <path
        strokeWidth="1.5"
        d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
      />
    </svg>
  );
}

