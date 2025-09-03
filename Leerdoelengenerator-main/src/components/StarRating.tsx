"use client";
import { useId } from "react";

type Props = {
  value: number;
  onChange: (n: number) => void;
  max?: number;          // default 5
  sizeClass?: string;    // bijv. "text-2xl"
};

export default function StarRating({ value, onChange, max = 5, sizeClass = "text-2xl" }: Props) {
  const gid = useId();
  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-labelledby={`${gid}-label`}>
      {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-label={`${n} ster${n > 1 ? "ren" : ""}`}
          aria-pressed={value >= n}
          className={`${sizeClass} leading-none transition-transform hover:scale-110
                      ${value >= n ? "text-yellow-400" : "text-gray-300"}`}
          title={`${n} ster${n > 1 ? "ren" : ""}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
