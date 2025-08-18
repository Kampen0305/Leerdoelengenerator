import React, { useState } from "react";
import { Star } from "lucide-react";
import { submitFeedback } from "../lib/feedback";

const stars = [1, 2, 3, 4, 5];

export const FeedbackBar: React.FC = () => {
  const [rating, setRating] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating === null) {
      setError("Kies een beoordeling");
      return;
    }
    try {
      submitFeedback({ rating, comment });
      setSubmitted(true);
      setError("");
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Ongeldige invoer");
      }
    }
  };

  if (submitted) {
    return <p className="mt-2 text-sm text-green-700">Dank je voor je feedback!</p>;
  }

  return (
    <div className="mt-4">
      <fieldset className="flex items-center" aria-label="Beoordeling">
        {stars.map((n) => (
          <label key={n} className="cursor-pointer" onMouseEnter={() => setHovered(n)} onMouseLeave={() => setHovered(null)}>
            <input
              type="radio"
              name="rating"
              value={n}
              checked={rating === n}
              onChange={() => setRating(n)}
              aria-label={`${n} ster${n > 1 ? "ren" : ""}`}
              className="sr-only"
            />
            <Star
              aria-hidden="true"
              className={`w-6 h-6 ${ (hovered ?? rating ?? 0) >= n ? "text-yellow-500 fill-yellow-500" : "text-gray-300" }`}
            />
          </label>
        ))}
      </fieldset>
      <div className="flex items-center mt-2 space-x-2">
        <label htmlFor="feedback-comment" className="sr-only">
          Opmerking
        </label>
        <input
          id="feedback-comment"
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={140}
          placeholder="Optionele opmerking"
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-3 py-2 rounded"
        >
          Verstuur
        </button>
      </div>
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
};

export default FeedbackBar;
