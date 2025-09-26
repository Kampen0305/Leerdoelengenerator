// === BEGIN: src/components/ToetsvormSearchModal.tsx ===
"use client";
import React, { useEffect } from "react";
import { useToetsvormSearch } from "@/hooks/useToetsvormSearch";
import { ToetsCategorie } from "@/data/toetsvormen";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ToetsvormSearchModal({ open, onClose }: Props) {
  const {
    query,
    setQuery,
    activeCats,
    toggleCat,
    categories,
    results,
  } = useToetsvormSearch();

  useEffect(() => {
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 p-4 md:p-8">
      <div className="w-full max-w-4xl rounded-2xl bg-white p-4 md:p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl md:text-2xl font-semibold">Zoek toetsvormen</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100"
            aria-label="Sluiten"
            title="Sluiten"
          >
            ✕
          </button>
        </div>

        {/* Zoekbalk */}
        <div className="mt-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Zoeken op naam of beschrijving…"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Filters */}
        <div className="mt-4">
          <p className="mb-2 text-sm font-medium text-gray-700">Categorieën</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((c: ToetsCategorie) => {
              const active = activeCats.includes(c);
              return (
                <button
                  key={c}
                  onClick={() => toggleCat(c)}
                  className={[
                    "rounded-full border px-3 py-1 text-sm",
                    active
                      ? "border-indigo-600 bg-indigo-600 text-white"
                      : "border-gray-300 bg-white text-gray-800 hover:bg-gray-50",
                  ].join(" ")}
                  aria-pressed={active}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        {/* Resultaten */}
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {results.length} resultaat{results.length === 1 ? "" : "en"}
            </p>
          </div>

          <ul className="mt-3 divide-y divide-gray-200 rounded-xl border border-gray-200">
            {results.map((t) => (
              <li key={t.id} className="p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <h3 className="text-base md:text-lg font-semibold">{t.naam}</h3>
                    {t.beschrijving && (
                      <p className="mt-1 text-sm text-gray-700">{t.beschrijving}</p>
                    )}
                    <div className="mt-2 flex flex-wrap gap-2">
                      {t.categorieen.map((c) => (
                        <span
                          key={c}
                          className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-800"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                  {/* 👉 Voorzie van jouw eigen deep-link of actie */}
                  <a
                    href={`#toetsvorm-${t.id}`}
                    className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
                  >
                    Bekijken
                  </a>
                </div>
              </li>
            ))}
            {results.length === 0 && (
              <li className="p-6 text-center text-sm text-gray-600">
                Geen resultaten. Pas je zoekterm of filters aan.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
// === EIND: src/components/ToetsvormSearchModal.tsx ===
