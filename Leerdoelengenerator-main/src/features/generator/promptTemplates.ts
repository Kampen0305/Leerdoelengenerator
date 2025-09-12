type PromptArgs = {
  basisTag: string; // verplicht; komt uit BASIS_PROMPT_TAG
  // ...overige inputvelden
};

export function buildPrompt(args: PromptArgs): string {
  return [
    "ACT AS: onderwijs-ontwerpassistent.",
    args.basisTag,  // >>> Dwing de gekozen basis af in de instructie <<<
    "OPDRACHT: genereer leerdoelen en uitwerking op juiste niveau; respecteer de gekozen basis.",
    "REGELS:",
    "- Verwijs inhoudelijk naar begrippen/kaders die passen bij de BASIS (géén mix).",
    "- Benoem waar relevant sector-specifieke accenten (funderend: kerndoelen; mbo/hbo/wo: leeruitkomsten/toetsing conform Npuls).",
    "- Lever duidelijke, toetsbare formuleringen.",
    "OUTPUTVORM:",
    "- Kop: ## Leerdoelen",
    "- Daarna secties (onderwijsactiviteiten/toetsing/criteria) afgestemd op het niveau.",
  ].join("\n");
}
