import Image from "next/image";
import Link from "next/link";

export default function DigitEdPromo() {
  return (
    <aside className="mx-auto my-8 w-full max-w-5xl rounded-2xl border border-zinc-200/60 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-zinc-800/60 dark:bg-zinc-900/60">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <div className="shrink-0">
          <Image
            src="/brand/digited-logo.png"
            alt="DigitEd"
            width={200}
            height={86}
            priority
            className="h-auto w-[180px] sm:w-[200px]"
          />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold tracking-tight bg-gradient-to-r from-green-700 to-yellow-500 bg-clip-text text-transparent">
            DigitEd – AI in het onderwijs
          </h2>
          <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
            Praktische workshops, AI-geletterdheid en advies – direct toepasbaar
            voor docenten, teams en organisaties.
          </p>
          <ul className="mt-3 list-disc pl-5 text-sm text-zinc-800 marker:text-green-700 dark:text-zinc-200">
            <li>Workshops AI in de klas &amp; formatief inzetten</li>
            <li>Trainingen AI-geletterdheid (o.a. ChatGPT/Copilot)</li>
            <li>Coaching &amp; advies: verantwoord AI-gebruik</li>
          </ul>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="https://digited.nl/contact/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-green-700 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Neem contact op
            </Link>
            <Link
              href="https://www.linkedin.com/in/edwinspielhagen"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            >
              Stuur LinkedIn-bericht
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
