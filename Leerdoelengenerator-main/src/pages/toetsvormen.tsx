// === BEGIN: anchors voorbeeld op toetsvormenpagina ===
import { TOETSVORMEN } from "@/data/toetsvormen";

export default function ToetsvormenPagina() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold">Toetsvormen</h1>
      <div className="mt-6 space-y-8">
        {TOETSVORMEN.map((t) => (
          <section key={t.id} id={`toetsvorm-${t.id}`} className="scroll-mt-24">
            <h2 className="text-xl font-semibold">{t.naam}</h2>
            {t.beschrijving && <p className="mt-1 text-gray-700">{t.beschrijving}</p>}
            <div className="mt-2 flex flex-wrap gap-2">
              {t.categorieen.map((c) => (
                <span key={c} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-800">
                  {c}
                </span>
              ))}
              {t.baan && (
                <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs text-indigo-700">
                  {t.baan}
                </span>
              )}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
// === EIND: anchors voorbeeld op toetsvormenpagina ===
