export type GlossaryCategory =
  | 'AI & Geletterdheid'
  | 'Toetsing & Examinering'
  | 'Kaders & Wetgeving'
  | 'Didactiek & Curriculum'
  | 'Datagebruik & Privacy'
  | 'Onderwijsniveaus';

export interface GlossaryItem {
  id: string;            // slug
  term: string;          // getoonde term
  definition: string;    // korte, heldere uitleg (2–6 zinnen)
  category: GlossaryCategory;
  alsoKnownAs?: string[]; // synoniemen
  seeAlso?: string[];     // verwijzingen naar andere ids
}
