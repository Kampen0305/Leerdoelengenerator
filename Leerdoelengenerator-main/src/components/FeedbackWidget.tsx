"use client";
import { useState } from "react";

type Props = {
  title?: string;
  className?: string;
};

export default function FeedbackWidget({
  title = "Hoe beoordeel je dit?",
  className = "",
}: Props) {
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [err, setErr] = useState<string | null>(null);

  async function send() {
    if (stars < 1) {
      setErr("Kies eerst een aantal sterren.");
      return;
    }
    setErr(null);
    setStatus("sending");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stars,
          comment,
          email,
          page: typeof window !== "undefined" ? window.location.href : "",
          ua: typeof navigator !== "undefined" ? navigator.userAgent : "",
          hp: "", // honeypot
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setStatus("ok");
    } catch (e) {
      console.error(e);
      setStatus("error");
      setErr("Verzenden mislukt. Probeer het later nog eens.");
    }
  }

  if (status === "ok") {
    return (
      <div className="mt-8 rounded-2xl border p-4">
        <p className="font-semibold">Bedankt voor je feedback! 🎉</p>
        <p className="text-sm opacity-75">We gebruiken dit om de tool te verbeteren.</p>
      </div>
    );
  }

  return (
    <section className={`mt-10 rounded-2xl border p-4 ${className}`} aria-labelledby="fd-title">
      <h3 id="fd-title" className="mb-2 font-semibold">{title}</h3>

      <div className="mb-3 flex gap-1" role="radiogroup" aria-label="Geef sterren">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setStars(n)}
            aria-pressed={stars >= n}
            aria-label={`${n} ster${n > 1 ? "ren" : ""}`}
            className={`text-2xl leading-none ${stars >= n ? "" : "opacity-30"}`}
            title={`${n} ster${n > 1 ? "ren" : ""}`}
          >
            ★
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Optioneel: licht je beoordeling kort toe…"
        className="mb-2 w-full rounded-lg border p-2"
        rows={3}
        maxLength={2000}
      />

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Optioneel: jouw e-mail (alleen voor terugkoppeling)"
        className="mb-3 w-full rounded-lg border p-2"
        maxLength={320}
      />

      {err && <p className="mb-2 text-sm text-red-600">{err}</p>}

      <button
        type="button"
        onClick={send}
        disabled={status === "sending"}
        className="rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {status === "sending" ? "Versturen…" : "Verstuur feedback"}
      </button>

      <p className="mt-2 text-xs opacity-60">
        We slaan niets op in een database; je feedback wordt alleen per e-mail verzonden.
      </p>
    </section>
  );
}

