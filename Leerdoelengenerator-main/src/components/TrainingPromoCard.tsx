import React from "react";

type Props = {
  className?: string;
};

export default function TrainingPromoCard({ className = "" }: Props) {
  return (
    <section
      className={
        "relative overflow-hidden rounded-2xl border bg-white/70 dark:bg-zinc-900/70 border-zinc-200 dark:border-zinc-800 p-6 md:p-8 " +
        className
      }
      aria-labelledby="trainingen-workshops-heading"
    >
      <div className="mx-auto max-w-5xl flex flex-col md:flex-row md:items-start gap-6">
        <div className="flex-1">
          <span className="inline-block rounded-full bg-[#2D864E]/10 text-[#2D864E] px-3 py-1 text-xs font-medium">
            Workshops & Trainingen
          </span>
          <h2 id="trainingen-workshops-heading" className="mt-3 text-2xl md:text-3xl font-semibold">
            AI in het onderwijs — praktisch & direct toepasbaar
          </h2>
          <p className="mt-3 text-zinc-700 dark:text-zinc-300">
            Ik help docenten en onderwijsondersteuners om AI vandaag al slim in te zetten. Hands‑on,
            met <strong>gratis tools</strong> (o.a. ChatGPT, Gemini, DeepSeek) en afgestemd op jouw context
            (VO, MBO, HBO, WO).
          </p>
          <ul className="mt-3 text-zinc-700 dark:text-zinc-300">
            <li>• Workshops AI‑geletterdheid (niveau 1 & 2)</li>
            <li>• Praktische toepassingen direct inzetbaar in jouw werk</li>
          </ul>

          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <a
              href="https://digited.nl/contact/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Neem contact op via DigitEd"
              className="inline-flex items-center justify-center rounded-xl px-5 py-3 bg-[#EF8D00] text-white font-medium shadow-sm hover:bg-[#d97800] focus:outline-none focus:ring-2 focus:ring-[#EF8D00]"
            >
              Neem contact op
            </a>
            <a
              href="https://digited.nl/contact/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Plan een vrijblijvende kennismaking"
              className="inline-flex items-center justify-center rounded-xl px-5 py-3 bg-white dark:bg-zinc-800 text-[#2D864E] border border-[#2D864E] hover:bg-[#2D864E]/10 dark:hover:bg-[#2D864E]/20 focus:outline-none focus:ring-2 focus:ring-[#2D864E]"
            >
              Plan kennismaking
            </a>
          </div>

          <p className="mt-3 text-xs text-zinc-500">
            Beschikbaar voor VO, MBO, HBO en WO • Op locatie of online
          </p>
        </div>
      </div>
    </section>
  );
}

