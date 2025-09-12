export type Sector = 'PO'|'SO'|'VO'|'VSO'|'MBO'|'HBO'|'WO';

export type Baan = 1 | 2 | null;

export interface GeneratorFormState {
  sector: Sector;
  // ... andere velden
  baan: Baan; // was 1|2 → nu ook null toegestaan
}

export type EducationCategory = 'FUNDEREND'|'BEROEPSONDERWIJS';
export type Lane = 'BAAN_1'|'BAAN_2';

export function toCategory(sector: Sector): EducationCategory {
  return (sector === 'PO' || sector === 'SO' || sector === 'VSO' || sector === 'VO')
    ? 'FUNDEREND'
    : 'BEROEPSONDERWIJS';
}

export function isBaanApplicable(sector: Sector): boolean {
  return toCategory(sector) === 'BEROEPSONDERWIJS';
}

// Generieke item-typen voor je linker “kaders” en rechter “voorbeelden” lijsten.
// Als jouw items al een eigen type hebben: voeg minimaal 'sector' of 'category' toe.
export interface HasSectorOrCategory {
  sector?: Sector;
  category?: EducationCategory;
  [k: string]: any;
}

export function filterBySectorOrCategory<T extends HasSectorOrCategory>(
  items: T[],
  sector: Sector
): T[] {
  const cat = toCategory(sector);
  return (items || []).filter(it => {
    // 1) Hard op sector matchen als aanwezig
    if (it.sector) {
      return toCategory(it.sector) === cat;
    }
    // 2) Anders op category matchen als aanwezig
    if (it.category) {
      return it.category === cat;
    }
    // 3) Geen metadata -> toon toch (of kies false om te verbergen)
    return false;
  });
}

// Helper om lane-state veilig te resetten wanneer sector → FUNDEREND switcht
export function normalizeLaneForSector(sector: Sector, lane?: Lane): Lane|undefined {
  return isBaanApplicable(sector) ? lane : undefined;
}
