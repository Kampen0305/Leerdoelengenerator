// === BEGIN: src/hooks/useToetsvormSearch.ts ===
import { useMemo, useState } from "react";
import { TOETSVORMEN, ALLE_CATEGORIEEN, Toetsvorm, ToetsCategorie } from "@/data/toetsvormen";

export function useToetsvormSearch() {
  const [query, setQuery] = useState("");
  const [activeCats, setActiveCats] = useState<ToetsCategorie[]>([]);
  const [onlyBaan, setOnlyBaan] = useState<"Baan 1" | "Baan 2" | "Beide" | "">("");

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

      // baan-filter (optioneel)
      const matchBaan = !onlyBaan || t.baan === onlyBaan || (onlyBaan === "Beide" && t.baan === "Beide");

      return matchText && matchCats && matchBaan;
    }).sort((a, b) => a.naam.localeCompare(b.naam));
  }, [query, activeCats, onlyBaan]);

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
    onlyBaan,
    setOnlyBaan,
    categories: ALLE_CATEGORIEEN,
    results,
  };
}
// === EIND: src/hooks/useToetsvormSearch.ts ===
