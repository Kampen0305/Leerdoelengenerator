import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function DigitEdPromo() {
  const [logoError, setLogoError] = useState(false);

  return (
    <aside
      role="complementary"
      aria-labelledby="digited-promo-title"
      className="mx-auto my-8 w-full max-w-5xl rounded-2xl border border-zinc-200/70 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-zinc-800/60 dark:bg-zinc-900/60"
    >
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <div className="shrink-0">
          {logoError ? (
            // Fallback: nette inline-SVG met 'DigitEd'
            <div
              aria-label="DigitEd"
              className="flex h-[72px] w-[200px] items-center justify-center rounded-xl border border-zinc-200/70 bg-white px-3 dark:border-zinc-800/60 dark:bg-zinc-900"
            >
              <svg
                width="180"
                height="36"
                viewBox="0 0 180 36"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="dg" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#2E8B57" />
                    <stop offset="100%" stopColor="#F5A623" />
                  </linearGradient>
                </defs>
                <text
                  x="0"
                  y="26"
                  fontFamily="Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial"
                  fontSize="26"
                  fontWeight="700"
                  fill="url(#dg)"
                >
                  DigitEd
                </text>
              </svg>
            </div>
          ) : (
            <Image
              src="/brand/digited-logo.png" // plaats dit bestand later zelf in /public/brand/
              alt="DigitEd"
              width={200}
              height={86}
              priority
              className="h-auto w-[180px] sm:w-[200px]"
              onError={() => setLogoError(true)}
            />
          )}
        </div>

        <div className="flex-1">
          <h2
            id="digited-promo-title"
            className="text-xl font-semibold tracking-tight"
            style={{
              backgroundImage: "linear-gradient(90deg,#2E8B57,#F5A623)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            DigitEd – AI in het onderwijs
          </h2>

          <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
            Praktische workshops, AI‑geletterdheid en advies – direct toepasbaar
            voor docenten, teams en organisaties.
          </p>

          <ul className="mt-3 list-disc pl-5 text-sm text-zinc-800 marker:text-zinc-500 dark:text-zinc-200">
            <li>Workshops AI in de klas &amp; formatief inzetten</li>
            <li>Trainingen AI‑geletterdheid (o.a. ChatGPT/Copilot)</li>
            <li>Coaching &amp; advies: verantwoord AI‑gebruik</li>
          </ul>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="https://digited.nl/contact/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Neem contact op met DigitEd"
              className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
              style={{ background: "linear-gradient(90deg,#2E8B57,#3aa76d)" }}
            >
              Neem contact op
            </Link>
            <Link
              href="https://www.linkedin.com/in/edwinspielhagen"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Stuur Edwin een bericht op LinkedIn"
              className="inline-flex items-center justify-center rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800 dark:focus:ring-zinc-700 dark:focus:ring-offset-zinc-900"
            >
              Stuur LinkedIn‑bericht
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}

