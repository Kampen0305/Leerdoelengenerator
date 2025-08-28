"use client";
import { useState } from "react";

export default function StarFeedback({ path }: { path: string }) {
  const [stars, setStars] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [sent, setSent] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function submit() {
    if (!stars) return;
    setSent("sending");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stars,
          comment,
          path,
          ua: navigator.userAgent,
        }),
      });
      setSent(res.ok ? "done" : "error");
      if (res.ok) {
        setComment("");
        setStars(0);
      }
    } catch {
      setSent("error");
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
        onClick={submit}
        disabled={sent === "sending" || !stars}
        className="mt-2 rounded bg-black px-3 py-2 text-white disabled:opacity-50"
      >
        {sent === "sending" ? "Versturen…" : "Verstuur feedback"}
      </button>

      {sent === "done" && (
        <p className="text-green-600 text-sm mt-2">
          Dank! Je feedback is verzonden.
        </p>
      )}
      {sent === "error" && (
        <p className="text-red-600 text-sm mt-2">
          Er ging iets mis. Probeer later opnieuw.
        </p>
      )}
    </div>
  );
}
