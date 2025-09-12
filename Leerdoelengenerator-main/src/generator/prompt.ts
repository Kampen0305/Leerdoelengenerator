import { LEVEL_TO_GROUP, type EducationLevel, type DomainGroup } from '@/types/education';

type PromptArgs = {
  level: EducationLevel;
  group: DomainGroup;
  topic: string;
  sources: string[]; // uit Task 2
};

export function buildPrompt(args: PromptArgs) {
  const { level, group, topic, sources } = args;
  const basis = sources.map((s) => `- ${s}`).join('\n');

  return `
SYSTEM
Je bent een onderwijskundige generator. Volg strikt het gekozen niveau en domeingroep.
- Gekozen niveau: ${level}
- Domeingroep: ${group}
- Je output MOET beginnen met: "Niveau: ${level}"
- Als je kennis buiten de basisbronnen nodig lijkt, geef dan GEEN aannames maar blijf binnen de bronnen.

USER
Genereer leerdoelen voor het onderwerp: "${topic}".

Randvoorwaarden:
- Pas taalniveau, terminologie en kaders toe die horen bij ${level} binnen ${group}.
- Gebruik uitsluitend onderstaande basisbronnen (citeer als lijst onder "Basis:")
${basis}

OUTPUT-FORMAT (strikt):
Niveau: ${level}
Domeingroep: ${group}
Titel: ...
Leerdoelen: 
- ...
- ...
Toelichting: ...
Basis:
${basis}
`;
}
