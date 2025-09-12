export function renderDoc({ basisLabel, content }: { basisLabel: string; content: string }) {
  // Voeg basisLabel toe aan titelpagina of documentfooter
  // (implementatie afhankelijk van bestaande lib – zorg dat basisLabel zichtbaar is)
  return `${basisLabel}\n\n${content}`;
}
