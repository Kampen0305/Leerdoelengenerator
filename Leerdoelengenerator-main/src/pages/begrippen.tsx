import { lazy, Suspense, useEffect } from 'react';

const GlossaryList = lazy(async () => {
  try {
    const mod = await import('@/components/Glossary/List');
    return { default: mod.default };
  } catch {
    return { default: () => null };
  }
});

function GlossaryFallback() {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Begrippenlijst</h2>
      <p className="opacity-80">
        De volledige begrippenlijst wordt geladen. Ondertussen zie je deze korte uitleg en links naar de belangrijkste items.
      </p>
      <ul className="list-disc pl-5">
        <li><a className="underline" href="#ai-ready-leerdoel">AI-ready leerdoel</a></li>
        <li><a className="underline" href="#two-lane-approach">Two-Lane approach</a></li>
        <li><a className="underline" href="#blooms-taxonomie">Bloom’s taxonomie</a></li>
        <li><a className="underline" href="#avg">AVG</a> &amp; <a className="underline" href="#ai-act">AI Act</a></li>
      </ul>
    </section>
  );
}

export default function BegrippenPage() {
  useEffect(() => {
    document.title = 'Begrippen | Leerdoelengenerator';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        'content',
        'Alle kernbegrippen over AI-ready leerdoelen, Two-Lane approach, Bloom, AI-GO, publieke waarden, AVG/AI Act en toetsing.'
      );
    }
  }, []);
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold">Begrippen</h1>
        <p className="opacity-80">
          Korte, praktische uitleg bij alle begrippen die je nodig hebt om AI-ready leerdoelen te maken en te beoordelen.
        </p>
      </header>

      <Suspense fallback={<GlossaryFallback />}>
        <GlossaryList />
      </Suspense>
      <noscript><GlossaryFallback /></noscript>

      <footer className="mt-12 text-sm opacity-70">
        Mis je een begrip? <a className="underline" href="/contact">Laat het weten</a>.
      </footer>
    </main>
  );
}
