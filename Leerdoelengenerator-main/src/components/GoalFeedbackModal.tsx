"use client";
import { useState } from "react";
import StarRating from "./StarRating";

type Props = {
  open: boolean;
  onClose: () => void;
  goalText: string;        // het net gegenereerde leerdoel
};

export default function GoalFeedbackModal({ open, onClose, goalText }: Props) {
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle"|"sending"|"ok"|"error">("idle");
  const [err, setErr] = useState<string | null>(null);

  if (!open) return null;

  async function send() {
    if (stars < 1) { setErr("Kies eerst een aantal sterren."); return; }
    setErr(null); setStatus("sending");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stars,
          comment,
          goal: goalText,                                   // ⬅️ meegeven aan API
          page: typeof window !== "undefined" ? window.location.href : "",
          ua: typeof navigator !== "undefined" ? navigator.userAgent : "",
          hp: "",
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setStatus("ok");
      setTimeout(onClose, 1200); // zacht sluiten
    } catch (e) {
      setStatus("error");
      setErr("Verzenden mislukt. Probeer het later nog eens.");
      console.error(e);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-5 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold">Hoe beoordeel je dit leerdoel?</h3>
          <button onClick={onClose} className="rounded-md p-1 text-gray-500 hover:bg-gray-100">✕</button>
        </div>

        <div className="mt-3 rounded-xl border bg-gray-50 p-3 text-sm">
          <p className="whitespace-pre-wrap">{goalText}</p>
        </div>

        <div className="mt-4">
          <StarRating value={stars} onChange={setStars} />
        </div>

        <textarea
          className="mt-3 w-full rounded-lg border p-2"
          rows={3}
          placeholder="Optioneel: licht je beoordeling kort toe…"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={2000}
        />

        {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
        {status === "ok" && <p className="mt-2 text-sm text-green-700">Bedankt! 🎉</p>}

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100">Later</button>
          <button
            onClick={send}
            disabled={status === "sending"}
            className="rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50"
          >
            {status === "sending" ? "Versturen…" : "Verstuur"}
          </button>
        </div>
      </div>
    </div>
  );
}
