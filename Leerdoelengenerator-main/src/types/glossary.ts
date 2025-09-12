export type BegripCategorie =
  | 'Kerndoelen'
  | 'Digitale Geletterdheid'
  | 'Toetsing & Examinering'
  | 'Didactische principes'
  | 'Kaders & Wetgeving'
  | 'Onderwijsniveaus'
  | 'Datagebruik & Privacy';

export interface Begrip {
  slug: string;            // url-slug, uniek
  titel: string;           // kaarttitel
  definitie: string;       // 1–2 zinnen, geen markdown
  categorie: BegripCategorie;
  zieOok?: string[];       // lijst van andere slugs
}
