import { useEffect } from 'react';
import GlossaryList from '@/components/Glossary/List';

export default function BegrippenPage() {
  useEffect(() => {
    document.title = 'Begrippen | Leerdoelengenerator';
  }, []);
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold">Begrippen</h1>
        <p className="opacity-80">
          Korte, praktische uitleg bij alle begrippen die je nodig hebt om AI-ready leerdoelen te maken en te beoordelen.
        </p>
      </header>
      <GlossaryList />
      <footer className="mt-12 text-sm opacity-70">
        Mis je een begrip? <a className="underline" href="/contact">Laat het weten</a>.
      </footer>
    </main>
  );
}
