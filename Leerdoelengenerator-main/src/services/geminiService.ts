private buildPrompt(context: LearningObjectiveContext, kdContext?: KDContext): string {
  const levelGuidance = this.getLevelSpecificGuidance(context.education, context.level);
  const domainGuidance = this.getDomainSpecificGuidance(context.domain);
  const nationalVisionGuidance = this.getNationalVisionGuidance();
  const languageGuidance = this.getLanguageAndComplexityGuidance(context.education, context.level);

  let kdContextText = '';
  if (kdContext?.title) {
    kdContextText = `
KWALIFICATIEDOSSIER CONTEXT:
- Titel: ${kdContext.title}
- Code: ${kdContext.code || 'Onbekend'}
${kdContext.relatedCompetencies?.length ? `- Gerelateerde competenties: ${kdContext.relatedCompetencies.map(c => c.title).join(', ')}` : ''}
${kdContext.relatedWorkProcesses?.length ? `- Gerelateerde werkprocessen: ${kdContext.relatedWorkProcesses.map(w => w.title).join(', ')}` : ''}
`;
  }

  return `Je bent een expert in AI-bewust onderwijs in Nederland. 
Transformeer het volgende traditionele leerdoel naar een AI-ready leerdoel volgens:
- Het **Referentiekader 2.0** (rechtvaardigheid, menselijkheid, autonomie)
- De **Handreikingen Npuls** (AI-gebruik in onderwijs)
- De landelijke visie op toetsing en examinering
- De richtlijnen voor taalniveau en toegankelijkheid

ORIGINEEL LEERDOEL: "${context.original}"

CONTEXT:
- Onderwijstype: ${context.education}
- Niveau: ${context.level}
- Beroepsdomein: ${context.domain}
${context.assessment ? `- Huidige toetsvorm: ${context.assessment}` : ''}

${kdContextText}

TAAL EN COMPLEXITEIT RICHTLIJNEN:
${languageGuidance}

LANDELIJKE VISIE RICHTLIJNEN:
${nationalVisionGuidance}

NIVEAU-SPECIFIEKE RICHTLIJNEN:
${levelGuidance}

DOMEIN-SPECIFIEKE RICHTLIJNEN:
${domainGuidance}

⚖️ **KERNWAARDEN UIT REFERENTIEKADER 2.0**
1. Rechtvaardigheid → inclusief, eerlijk, bias vermijden
2. Menselijkheid → betekenisvol contact, menselijke blik blijft belangrijk
3. Autonomie → behoud van keuzevrijheid en menselijke controle

✅ OUTPUT (JSON):
{
  "newObjective": "Het AI-ready leerdoel, passend bij niveau, taal en richtlijnen",
  "rationale": "Korte uitleg waarom dit leerdoel AI-ready is én hoe het aansluit bij de kernwaarden (rechtvaardigheid, menselijkheid, autonomie)",
  "activities": [
    "Activiteit 1 (toegankelijk en inclusief)",
    "Activiteit 2 (kritisch en ethisch AI-gebruik)",
    "Activiteit 3 (transparantie en samenwerking)"
  ],
  "assessments": [
    "Toetsvorm 1 (authentiek en eerlijk)",
    "Toetsvorm 2 (proces en reflectie op AI-gebruik)"
  ]
}

BELANGRIJK:
- Gebruik altijd eenvoudige, duidelijke taal op het juiste niveau.
- Voeg in de rationale expliciet toe hoe de kernwaarden geborgd zijn.
- Geen wollige of academische taal, tenzij het niveau HBO/WO is.`;
}
