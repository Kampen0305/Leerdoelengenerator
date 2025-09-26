// === BEGIN: src/hooks/useToetsvormSearch.ts ===
import { useMemo, useState } from "react";
import { TOETSVORMEN, ALLE_CATEGORIEEN, Toetsvorm, ToetsCategorie } from "@/data/toetsvormen";

export function useToetsvormSearch() {
  const [query, setQuery] = useState("");
  const [activeCats, setActiveCats] = useState<ToetsCategorie[]>([]);

  const results = useMemo<Toetsvorm[]>(() => {
    const q = query.trim().toLowerCase();

    return TOETSVORMEN.filter((t) => {
      // tekstzoek: naam + beschrijving
      const matchText =
        !q ||
        t.naam.toLowerCase().includes(q) ||
        (t.beschrijving?.toLowerCase().includes(q) ?? false);

      // categorie-filter (AND: alle gekozen categorieën moeten voorkomen)
      const matchCats =
        activeCats.length === 0 ||
        activeCats.every((c) => t.categorieen.includes(c));

      return matchText && matchCats;
    }).sort((a, b) => a.naam.localeCompare(b.naam));
  }, [query, activeCats]);

  function toggleCat(cat: ToetsCategorie) {
    setActiveCats((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  return {
    query,
    setQuery,
    activeCats,
    toggleCat,
    categories: ALLE_CATEGORIEEN,
    results,
  };
}
// === EIND: src/hooks/useToetsvormSearch.ts ===
