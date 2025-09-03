import React, { useState } from "react";

export default function FeedbackForm() {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("Versturen...");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          comment,
          page: window.location.pathname,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setStatus(`Fout: ${data.error || "Onbekend"}`);
      } else {
        setStatus("✅ Feedback verstuurd, dankjewel!");
        setComment("");
      }
    } catch (err: any) {
      setStatus(`Fout: ${err.message}`);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>Geef je beoordeling:</p>
      <input
        type="number"
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        min={1}
        max={5}
      />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Optioneel: licht je beoordeling toe..."
      />
      <button type="submit">Verstuur feedback</button>
      {status && <p>{status}</p>}
    </form>
  );
}
