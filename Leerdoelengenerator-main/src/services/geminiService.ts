import { GoogleGenerativeAI } from '@google/generative-ai';

interface LearningObjectiveContext {
  original: string;
  education: string;
  level: string;
  domain: string;
  assessment?: string;
}

interface KDContext {
  title?: string;
  code?: string;
  relatedCompetencies?: Array<{ title: string; description: string }>;
  relatedWorkProcesses?: Array<{ title: string; description: string }>;
}

interface GeminiResponse {
  newObjective: string;
  rationale: string;
  activities: string[];
  assessments: string[];
}

export class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;

  constructor() {
    // Initialize Gemini with API key from environment variable
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    // Debug logging
    console.log('🔍 Gemini Service Debug Info:');
    console.log('- API Key exists:', apiKey ? 'YES' : 'NO');
    console.log('- API Key length:', apiKey ? apiKey.length : 0);
    console.log('- API Key starts with:', apiKey ? apiKey.substring(0, 10) + '...' : 'N/A');
    console.log('- Environment variables:', import.meta.env);
    
    if (apiKey && apiKey !== 'your_gemini_api_key_here') {
      try {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        console.log('✅ Gemini service initialized successfully');
      } catch (error) {
        console.error('❌ Error initializing Gemini service:', error);
      }
    } else {
      console.warn('⚠️ Gemini API key not found or is placeholder value');
      console.warn('Please check your .env file and make sure VITE_GEMINI_API_KEY is set');
    }
  }

  isAvailable(): boolean {
    const available = this.model !== null;
    console.log('🔍 Gemini service available:', available);
    return available;
  }

  async generateAIReadyObjective(
    context: LearningObjectiveContext,
    kdContext?: KDContext
  ): Promise<GeminiResponse> {
    console.log('🚀 Starting Gemini API call...');
    console.log('- Context:', context);
    console.log('- KD Context:', kdContext);
    
    if (!this.model) {
      console.error('❌ Gemini model not available');
      throw new Error('Gemini API niet beschikbaar. Controleer uw API-sleutel.');
    }

    const prompt = this.buildPrompt(context, kdContext);
    console.log('📝 Generated prompt length:', prompt.length);
    
    try {
      console.log('📡 Making API call to Gemini...');
      const result = await this.model.generateContent(prompt);
      console.log('📥 Received response from Gemini');
      
      const response = await result.response;
      const text = response.text();
      console.log('📄 Response text length:', text.length);
      console.log('📄 Response preview:', text.substring(0, 200) + '...');
      
      const parsedResponse = this.parseGeminiResponse(text);
      console.log('✅ Successfully parsed Gemini response');
      return parsedResponse;
    } catch (error) {
      console.error('❌ Gemini API error:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      throw new Error(`Fout bij het genereren van AI-ready leerdoel: ${error.message}`);
    }
  }

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

    return `Je bent een expert in AI-bewust onderwijs volgens de Nederlandse landelijke visie. Transformeer het volgende traditionele leerdoel naar een AI-ready versie die volledig aansluit bij de Nederlandse richtlijnen voor kansengelijkheid en ethisch AI-gebruik in het onderwijs.

ORIGINEEL LEERDOEL: "${context.original}"

CONTEXT:
- Onderwijstype: ${context.education}
- Niveau: ${context.level}
- Beroepsdomein: ${context.domain}
${context.assessment ? `- Huidige toetsvorm: ${context.assessment}` : ''}

${kdContextText}

KRITIEK BELANGRIJK - TAAL EN COMPLEXITEIT RICHTLIJNEN:
${languageGuidance}

LANDELIJKE VISIE RICHTLIJNEN:
${nationalVisionGuidance}

NIVEAU-SPECIFIEKE RICHTLIJNEN:
${levelGuidance}

DOMEIN-SPECIFIEKE RICHTLIJNEN:
${domainGuidance}

VERPLICHTE ELEMENTEN VOOR AI-READY LEERDOELEN:
1. **Kansengelijkheid**: Zorg dat AI-gebruik toegankelijk is voor alle studenten, ongeacht achtergrond
2. **Ethisch bewustzijn**: Integreer bewustzijn van bias, privacy en verantwoordelijk AI-gebruik
3. **Kritisch denken**: Behoud menselijke autonomie en kritische evaluatie van AI-output
4. **Transparantie**: Studenten moeten begrijpen hoe AI-tools werken en hun beperkingen
5. **Inclusiviteit**: AI-tools moeten geschikt zijn voor diverse leerbehoeften
6. **Veiligheid**: Waarborg data-privacy en ethische AI-toepassing

TOETSING EN BEOORDELING PRINCIPES:
- Gebruik authentieke beoordelingen die AI-gebruik integreren
- Focus op proces én product
- Beoordeel kritische reflectie op AI-gebruik
- Waarborg eerlijke toetsing voor alle studenten
- Integreer peer-review en zelfbeoordeling

GEWENSTE OUTPUT FORMAAT (JSON):
{
  "newObjective": "Het nieuwe AI-ready leerdoel dat volledig aansluit bij de landelijke visie EN het taalniveau van ${context.education} ${context.level}",
  "rationale": "Uitleg waarom deze aanpassing belangrijk is voor kansengelijkheid en ethisch AI-gebruik (2-3 zinnen) - GEBRUIK HET JUISTE TAALNIVEAU",
  "activities": [
    "Leeractiviteit 1 (inclusief en toegankelijk) - EENVOUDIGE TAAL",
    "Leeractiviteit 2 (met focus op ethisch bewustzijn) - EENVOUDIGE TAAL",
    "Leeractiviteit 3 (kritische evaluatie van AI) - EENVOUDIGE TAAL",
    "Leeractiviteit 4 (transparantie en begrip van AI-werking) - EENVOUDIGE TAAL",
    "Leeractiviteit 5 (samenwerking en peer-learning) - EENVOUDIGE TAAL"
  ],
  "assessments": [
    "Toetsvorm 1 (authentiek en inclusief) - EENVOUDIGE TAAL",
    "Toetsvorm 2 (proces-georiënteerd) - EENVOUDIGE TAAL",
    "Toetsvorm 3 (reflectie op AI-gebruik en ethiek) - EENVOUDIGE TAAL",
    "Toetsvorm 4 (peer-review component) - EENVOUDIGE TAAL"
  ]
}

BELANGRIJK: Zorg ervoor dat ALLE tekst (newObjective, rationale, activities, assessments) geschreven is op het taalniveau van ${context.education} ${context.level}. Gebruik de taalrichtlijnen hierboven STRIKT. Geen complexe woorden voor lagere niveaus!`;
  }

  private getLanguageAndComplexityGuidance(education: string, level: string): string {
    const isLevel1 = level?.includes('Niveau 1');
    const isLevel2 = level?.includes('Niveau 2');
    const isLevel3 = level?.includes('Niveau 3');
    const isLevel4 = level?.includes('Niveau 4');
    const isHBOBachelor = level?.includes('Bachelor') && education === 'HBO';
    const isWOBachelor = level?.includes('Bachelor') && education === 'WO';
    const isMaster = level?.includes('Master');

    if (isLevel1) {
      return `
**VERPLICHT TAALNIVEAU VOOR MBO NIVEAU 1 - ZEER EENVOUDIG:**

SCHRIJFREGELS (STRIKT NALEVEN):
- Gebruik alleen korte zinnen (maximaal 12 woorden)
- Gebruik alleen woorden die iedereen kent
- Gebruik "je" in plaats van "de student"
- Gebruik "doen" woorden: "je maakt", "je controleert", "je kijkt"
- Geen moeilijke woorden!

VERPLICHTE WOORDKEUZE:
- "AI-tools" → "computer-hulp" of "slimme programma's"
- "evalueren" → "controleren" of "kijken of het goed is"
- "kritisch beoordelen" → "goed kijken of het klopt"
- "transparant" → "duidelijk uitleggen"
- "bias" → "niet eerlijk" of "vooroordelen"
- "ethisch" → "goed en eerlijk"
- "competenties" → "wat je kunt"
- "implementeren" → "gebruiken"
- "analyseren" → "bekijken"

VOORBEELDEN GOEDE ZINNEN:
- "Je gebruikt computer-hulp voor je werk"
- "Je kijkt of het resultaat goed is"
- "Je legt uit wat je hebt gedaan"
- "Je werkt samen met anderen"

VOORBEELDEN SLECHTE ZINNEN (NIET GEBRUIKEN):
- "De student evalueert AI-output kritisch"
- "Implementeer strategische AI-oplossingen"
- "Analyseer de ethische implicaties"

ACTIVITEITEN MOETEN ZIJN:
- Praktisch en herkenbaar
- Stap voor stap uitgelegd
- Met voorbeelden uit het echte werk
- Samen met anderen doen

TOETSING MOET ZIJN:
- Laten zien wat je kunt
- Uitleggen wat je hebt gedaan
- Samen bespreken
- Praktische opdrachten`;
    }

    if (isLevel2) {
      return `
**VERPLICHT TAALNIVEAU VOOR MBO NIVEAU 2 - EENVOUDIG:**

SCHRIJFREGELS (STRIKT NALEVEN):
- Gebruik korte tot middellange zinnen (maximaal 15 woorden)
- Leg moeilijke woorden uit tussen haakjes
- Gebruik "je" of "de student"
- Gebruik concrete voorbeelden
- Vermijd ingewikkelde zinnen

VERPLICHTE WOORDKEUZE:
- "AI-tools" → "AI-hulpmiddelen" (leg uit: slimme computerprogramma's)
- "evalueren" → "controleren en beoordelen"
- "kritisch denken" → "goed nadenken en controleren"
- "transparant" → "duidelijk en open"
- "bias" → "vooroordelen" (leg uit: niet eerlijk behandelen)
- "ethisch gebruik" → "eerlijk en verantwoord gebruik"
- "competenties" → "vaardigheden"

VOORBEELDEN GOEDE ZINNEN:
- "Je controleert of de AI eerlijk is en geen vooroordelen heeft"
- "Je gebruikt AI-hulpmiddelen voor je werk"
- "Je legt duidelijk uit hoe je AI hebt gebruikt"

ACTIVITEITEN MOETEN ZIJN:
- Praktijkgericht met duidelijke instructies
- Met voorbeelden uit het werk
- Stap voor stap uitgelegd
- Met reflectie in eenvoudige taal

TOETSING MOET ZIJN:
- Praktische opdrachten uit het werk
- Portfolio met uitleg
- Gesprekken over wat je hebt geleerd
- Samenwerken en elkaar helpen`;
    }

    if (isLevel3) {
      return `
**VERPLICHT TAALNIVEAU VOOR MBO NIVEAU 3 - HELDER EN PROFESSIONEEL:**

SCHRIJFREGELS (STRIKT NALEVEN):
- Gebruik heldere, professionele zinnen (maximaal 20 woorden)
- Introduceer vaktermen met uitleg
- Gebruik "de student" in leerdoelen, "je" in instructies
- Gebruik voorbeelden uit de beroepspraktijk
- Balanceer tussen toegankelijk en professioneel

VERPLICHTE WOORDKEUZE:
- "AI-tools" → gebruik de term, leg uit wat het betekent
- "evalueren" → "beoordelen en controleren"
- "kritisch analyseren" → "zorgvuldig onderzoeken en beoordelen"
- "transparantie" → "duidelijkheid over hoe iets werkt"
- "bias-bewustzijn" → "bewust zijn van vooroordelen"
- "ethische overwegingen" → "nadenken over wat goed en fout is"

VOORBEELDEN GOEDE ZINNEN:
- "De student beoordeelt AI-output kritisch op kwaliteit en vooroordelen"
- "Je gebruikt AI-tools verantwoord en legt uit hoe je dit doet"
- "De student werkt samen om AI-resultaten te controleren"

ACTIVITEITEN MOETEN ZIJN:
- Realistische beroepssituaties
- Met reflectie en zelfevaluatie
- Professionele vaardigheden
- Casestudies uit de praktijk

TOETSING MOET ZIJN:
- Authentieke beroepsopdrachten
- Portfolio met reflectie
- Presentaties over het werkproces
- Peer-review en feedback`;
    }

    if (isLevel4) {
      return `
**VERPLICHT TAALNIVEAU VOOR MBO NIVEAU 4 - PROFESSIONEEL:**

SCHRIJFREGELS (STRIKT NALEVEN):
- Gebruik professionele, duidelijke zinnen (maximaal 25 woorden)
- Gebruik vaktermen correct en consistent
- Gebruik "de student" in leerdoelen
- Integreer strategische aspecten
- Houd het wel begrijpelijk

VERPLICHTE WOORDKEUZE:
- Gebruik professionele terminologie met uitleg waar nodig
- "strategisch AI-gebruik" → "doordacht en planmatig AI-gebruik"
- "kritische evaluatie" → "grondige beoordeling en analyse"
- "ethische verantwoordelijkheid" → "verantwoordelijkheid voor goed AI-gebruik"
- "transparante verantwoording" → "duidelijke uitleg van keuzes"

VOORBEELDEN GOEDE ZINNEN:
- "De student integreert AI-tools strategisch in werkprocessen"
- "De student evalueert AI-output kritisch op bias en ethische aspecten"
- "De student neemt verantwoordelijkheid voor eerlijk AI-gebruik"

ACTIVITEITEN MOETEN ZIJN:
- Complexe, realistische projecten
- Leidinggevende aspecten
- Strategische besluitvorming
- Reflectie op professioneel niveau

TOETSING MOET ZIJN:
- Strategische projecten
- Leidinggevende opdrachten
- Reflectie op organisatieniveau
- Innovatieve oplossingen`;
    }

    if (isHBOBachelor) {
      return `
**VERPLICHT TAALNIVEAU VOOR HBO BACHELOR - ACADEMISCH MAAR TOEGANKELIJK:**

SCHRIJFREGELS (STRIKT NALEVEN):
- Gebruik academische maar toegankelijke taal
- Integreer theorie met praktijk
- Gebruik "de student" in formele context
- Verwijs naar onderzoek waar relevant
- Houd het wel begrijpelijk

VERPLICHTE WOORDKEUZE:
- Gebruik academische terminologie correct
- "evidence-based AI-implementatie"
- "kritische analyse van AI-systemen"
- "ethische frameworks voor AI-gebruik"
- "interdisciplinaire samenwerking"
- "reflectieve praktijk"

VOORBEELDEN GOEDE ZINNEN:
- "De student analyseert AI-systemen vanuit ethische perspectieven"
- "De student ontwikkelt evidence-based strategieën voor AI-gebruik"
- "De student integreert onderzoek in AI-implementatie"

ACTIVITEITEN MOETEN ZIJN:
- Onderzoeksgerichte opdrachten
- Literatuurstudie en theorie
- Analytische vaardigheden
- Academische reflectie

TOETSING MOET ZIJN:
- Onderzoeksrapporten
- Theoretische analyses
- Peer-review processen
- Academische presentaties`;
    }

    if (isWOBachelor || isMaster) {
      return `
**VERPLICHT TAALNIVEAU VOOR WO BACHELOR/MASTER - WETENSCHAPPELIJK:**

SCHRIJFREGELS (STRIKT NALEVEN):
- Gebruik wetenschappelijke, precieze taal
- Integreer theoretische frameworks
- Gebruik "de student" of "de onderzoeker"
- Verwijs naar actueel onderzoek
- Focus op kritische analyse

VERPLICHTE WOORDKEUZE:
- Gebruik wetenschappelijke terminologie
- "epistemologische overwegingen bij AI"
- "methodologische implicaties van AI-gebruik"
- "kritische discoursanalyse van AI-systemen"
- "interdisciplinaire theoretische frameworks"
- "reflexieve onderzoekspraktijk"

VOORBEELDEN GOEDE ZINNEN:
- "De student onderzoekt epistemologische implicaties van AI-gebruik"
- "De student ontwikkelt kritische theoretische frameworks voor AI-ethiek"
- "De student voert reflexief onderzoek uit naar AI-impact"

ACTIVITEITEN MOETEN ZIJN:
- Wetenschappelijke onderzoeksmethoden
- Theorievorming en kritische analyse
- Originele bijdragen aan kennis
- Wetenschappelijke publicatie

TOETSING MOET ZIJN:
- Wetenschappelijke papers
- Theoretische analyses
- Peer-review processen
- Conferentiepresentaties`;
    }

    return `
**ALGEMENE TAALRICHTLIJNEN:**
- Pas de taal aan het onderwijsniveau aan
- Gebruik heldere, begrijpelijke zinnen
- Leg vaktermen uit waar nodig
- Gebruik concrete voorbeelden
- Focus op praktische toepassingen`;
  }

  private getNationalVisionGuidance(): string {
    return `
NEDERLANDSE VISIE OP AI EN KANSENGELIJKHEID IN HET ONDERWIJS:

**Kernprincipes:**
1. **Toegankelijkheid voor iedereen**: AI-tools moeten beschikbaar en bruikbaar zijn voor alle studenten, ongeacht sociaaleconomische achtergrond, beperking of voorkennis
2. **Bias-bewustzijn**: Studenten leren herkennen en aanpakken van vooroordelen in AI-systemen
3. **Transparantie**: Duidelijkheid over hoe AI-tools werken en beslissingen nemen
4. **Menselijke autonomie**: AI ondersteunt maar vervangt niet menselijke creativiteit en kritisch denken
5. **Ethische reflectie**: Bewustzijn van maatschappelijke impact van AI-gebruik
6. **Inclusieve ontwikkeling**: AI-oplossingen die rekening houden met diversiteit in leerbehoeften

**Praktische implementatie:**
- Gebruik diverse AI-tools om vendor lock-in te voorkomen
- Zorg voor digitale geletterdheid als basis voor AI-gebruik
- Integreer ethische dilemma's en casestudies in het curriculum
- Stimuleer samenwerking tussen studenten met verschillende achtergronden
- Bied ondersteuning voor studenten die minder vertrouwd zijn met technologie
- Gebruik AI om gepersonaliseerd leren mogelijk te maken zonder discriminatie

**Toetsing en beoordeling:**
- Ontwikkel beoordelingscriteria die AI-gebruik waarderen maar niet verplichten
- Zorg voor alternatieve toetsvormen voor studenten zonder toegang tot AI-tools
- Beoordeel het proces van AI-gebruik, niet alleen het eindresultaat
- Integreer reflectie op ethische aspecten van AI-gebruik in beoordelingen
- Gebruik AI zelf om bias in beoordeling te verminderen

**Docent ondersteuning:**
- Bied training aan docenten over ethisch AI-gebruik
- Ontwikkel richtlijnen voor verantwoord AI-gebruik in het onderwijs
- Creëer ruimte voor experimenteren en leren van fouten
- Stimuleer interdisciplinaire samenwerking rond AI-thema's`;
  }

  private getLevelSpecificGuidance(education: string, level: string): string {
    const isLevel1 = level?.includes('Niveau 1');
    const isLevel2 = level?.includes('Niveau 2');
    const isLevel3 = level?.includes('Niveau 3');
    const isLevel4 = level?.includes('Niveau 4');
    const isHBOBachelor = level?.includes('Bachelor') && education === 'HBO';
    const isWOBachelor = level?.includes('Bachelor') && education === 'WO';
    const isMaster = level?.includes('Master');

    if (isLevel1) {
      return `
MBO NIVEAU 1 - TOEGANKELIJKE AI-INTEGRATIE:
- Gebruik zeer eenvoudige, visuele AI-tools met duidelijke interface
- Focus op praktische toepassingen die direct herkenbaar zijn
- Bied veel begeleiding en stap-voor-stap instructies
- Zorg voor hands-on ervaring met concrete voorbeelden
- Integreer basis digitale vaardigheden voordat AI wordt geïntroduceerd
- Gebruik peer-learning om studenten elkaar te laten ondersteunen
- Activiteiten: demonstraties, begeleide oefeningen, groepswerk
- Toetsing: praktische demonstraties met ondersteuning, portfolio met visuele elementen
- Ethiek: eenvoudige voorbeelden van eerlijk vs oneerlijk AI-gebruik`;
    }

    if (isLevel2) {
      return `
MBO NIVEAU 2 - BEGELEID AI-GEBRUIK:
- Introduceer AI-tools met duidelijke uitleg van werking en doel
- Focus op herkenbare beroepssituaties en praktische toepassingen
- Bied gestructureerde begeleiding met geleidelijke zelfstandigheid
- Integreer basis ethische overwegingen in concrete situaties
- Gebruik samenwerking om verschillende perspectieven te delen
- Activiteiten: begeleide projecten, vergelijken van AI-tools, groepsdiscussies
- Toetsing: praktijkopdrachten met reflectie, peer-beoordeling
- Ethiek: herkennen van bias in eigen vakgebied, privacy-bewustzijn`;
    }

    if (isLevel3) {
      return `
MBO NIVEAU 3 - ZELFSTANDIG EN KRITISCH AI-GEBRUIK:
- Ontwikkel kritische evaluatievaardigheden voor AI-output
- Integreer ethische dilemma's specifiek voor het beroepsdomein
- Stimuleer zelfstandige keuzes in AI-tool selectie en gebruik
- Focus op kwaliteitscontrole en verantwoording van AI-gebruik
- Activiteiten: zelfstandige projecten, ethische casestudies, presentaties
- Toetsing: portfolio's met kritische reflectie, authentieke beoordelingen
- Ethiek: professionele verantwoordelijkheid, impact op werkgelegenheid`;
    }

    if (isLevel4) {
      return `
MBO NIVEAU 4 - STRATEGISCH EN VERANTWOORDELIJK AI-GEBRUIK:
- Ontwikkel strategisch inzicht in AI-mogelijkheden en beperkingen
- Integreer leiderschapsaspecten en teamverantwoordelijkheid
- Focus op innovatie en verbetering van werkprocessen met AI
- Benadruk maatschappelijke verantwoordelijkheid en ethische leiding
- Activiteiten: strategische projecten, leidinggeven aan AI-implementatie, onderzoek
- Toetsing: complexe opdrachten, strategische adviezen, reflectieverslagen
- Ethiek: organisatorische verantwoordelijkheid, maatschappelijke impact`;
    }

    if (isHBOBachelor) {
      return `
HBO BACHELOR - EVIDENCE-BASED EN INNOVATIEF AI-GEBRUIK:
- Ontwikkel onderzoeksvaardigheden voor AI-evaluatie en -implementatie
- Integreer wetenschappelijke literatuur over AI-ethiek en -impact
- Focus op innovatieve toepassingen en strategische implementatie
- Benadruk interdisciplinaire samenwerking en kennisdeling
- Activiteiten: onderzoeksprojecten, literatuurstudies, innovatieprojecten
- Toetsing: onderzoeksrapporten, strategische adviezen, peer-review
- Ethiek: wetenschappelijke integriteit, maatschappelijke verantwoordelijkheid`;
    }

    if (isWOBachelor || isMaster) {
      return `
WO BACHELOR/MASTER - WETENSCHAPPELIJK EN KRITISCH AI-ONDERZOEK:
- Ontwikkel diepgaand begrip van AI-algoritmes en hun maatschappelijke impact
- Integreer filosofische en ethische theorieën over AI en technologie
- Focus op wetenschappelijk onderzoek naar AI-toepassingen en -effecten
- Benadruk kritische analyse van AI-ontwikkelingen en -trends
- Activiteiten: wetenschappelijk onderzoek, theoretische analyse, publicaties
- Toetsing: dissertaties, wetenschappelijke artikelen, conferentiepresentaties
- Ethiek: academische integriteit, maatschappelijke verantwoordelijkheid van wetenschap`;
    }

    return `
ALGEMEEN - NIVEAU-PASSENDE AI-INTEGRATIE:
- Pas AI-gebruik aan het cognitieve en praktische niveau van studenten aan
- Zorg voor geleidelijke opbouw van AI-vaardigheden en ethisch bewustzijn
- Integreer kansengelijkheid in alle aspecten van AI-onderwijs`;
  }

  private getDomainSpecificGuidance(domain: string): string {
    // Add robust validation for domain parameter
    if (!domain || typeof domain !== 'string') {
      console.warn('⚠️ Domain parameter is undefined or not a string, using fallback guidance');
      return this.getFallbackDomainGuidance();
    }

    const domainLower = domain.toLowerCase();

    if (domainLower.includes('zorg') || domainLower.includes('verpleeg') || domainLower.includes('welzijn')) {
      return `
ZORG/VERPLEEGKUNDE - ETHISCHE AI-TOEPASSING:
- **Patiëntveiligheid**: AI mag nooit de primaire besluitvorming over patiëntenzorg vervangen
- **Privacy**: Strikte naleving van AVG en medische privacy-regelgeving
- **Bias-bewustzijn**: Herkenning van vooroordelen in medische AI-systemen
- **Menselijke zorg**: Behoud van empathie en persoonlijke zorg naast AI-ondersteuning
- **Toegankelijkheid**: AI-tools die alle patiënten ten goede komen, ongeacht achtergrond
- Activiteiten: ethische casestudies, privacy-training, bias-detectie oefeningen
- Toetsing: simulaties met AI-ondersteuning, ethische reflectieverslagen
- Focus: verantwoordelijk gebruik van diagnostische AI, patiëntcommunicatie`;
    }

    if (domainLower.includes('ict') || domainLower.includes('techniek') || domainLower.includes('software')) {
      return `
ICT/TECHNIEK - VERANTWOORDELIJKE AI-ONTWIKKELING:
- **Inclusief ontwerp**: Ontwikkel AI-systemen die toegankelijk zijn voor iedereen
- **Bias-preventie**: Implementeer technieken om vooroordelen in AI te voorkomen
- **Transparantie**: Creëer uitlegbare AI-systemen waar mogelijk
- **Veiligheid**: Waarborg cybersecurity en data-integriteit
- **Duurzaamheid**: Overweeg milieu-impact van AI-systemen
- Activiteiten: bias-testing, inclusief design workshops, ethische code-reviews
- Toetsing: portfolio met ethische overwegingen, peer-review van AI-projecten
- Focus: responsible AI development, algorithmic accountability`;
    }

    if (domainLower.includes('marketing') || domainLower.includes('communicatie') || domainLower.includes('media')) {
      return `
MARKETING/COMMUNICATIE - ETHISCHE AI-COMMUNICATIE:
- **Transparantie**: Duidelijke communicatie over AI-gebruik in marketing
- **Manipulatie-preventie**: Vermijd misleidende of manipulatieve AI-toepassingen
- **Diversiteit**: Zorg voor inclusieve representatie in AI-gegenereerde content
- **Privacy**: Respecteer consumentenprivacy bij AI-gedreven targeting
- **Authenticiteit**: Behoud menselijke creativiteit en authentieke merkidentiteit
- Activiteiten: ethische marketing casestudies, diversiteitsanalyses, transparantie-oefeningen
- Toetsing: campagnes met ethische verantwoording, reflectie op AI-impact
- Focus: responsible marketing AI, consumer protection`;
    }

    if (domainLower.includes('financ') || domainLower.includes('administrat') || domainLower.includes('boekhou')) {
      return `
FINANCIËN/ADMINISTRATIE - BETROUWBARE AI-TOEPASSING:
- **Nauwkeurigheid**: Waarborg correctheid van AI-ondersteunde financiële analyses
- **Compliance**: Naleving van financiële regelgeving bij AI-gebruik
- **Bias-preventie**: Voorkom discriminatie in AI-gedreven financiële beslissingen
- **Transparantie**: Uitlegbare AI voor financiële adviezen en beslissingen
- **Toegankelijkheid**: Eerlijke toegang tot AI-ondersteunde financiële diensten
- Activiteiten: compliance-training, bias-detectie in financiële AI, transparantie-oefeningen
- Toetsing: ethische financiële analyses, compliance-rapporten
- Focus: fair lending AI, transparent financial algorithms`;
    }

    if (domainLower.includes('onderwijs') || domainLower.includes('pedagogiek')) {
      return `
ONDERWIJS/PEDAGOGIEK - INCLUSIEVE AI-TOEPASSING:
- **Leerling-centraal**: AI moet alle leerlingen ondersteunen, niet selecteren
- **Bias-bewustzijn**: Herken en voorkom vooroordelen in educatieve AI
- **Privacy**: Bescherm leerlinggegevens en respecteer ouderlijke rechten
- **Toegankelijkheid**: AI-tools die geschikt zijn voor diverse leerbehoeften
- **Pedagogische waarde**: AI moet leren versterken, niet vervangen
- Activiteiten: inclusief AI-ontwerp, privacy-training, pedagogische AI-evaluatie
- Toetsing: reflectie op AI-impact op leerlingen, ethische lesplannen
- Focus: equitable educational AI, student data protection`;
    }

    return this.getFallbackDomainGuidance();
  }

  private getFallbackDomainGuidance(): string {
    return `
ALGEMEEN DOMEIN - ETHISCHE AI-TOEPASSING:
- **Kansengelijkheid**: Zorg dat AI-gebruik eerlijke kansen biedt voor iedereen
- **Transparantie**: Wees open over AI-gebruik en beperkingen
- **Bias-bewustzijn**: Herken en pak vooroordelen in AI-systemen aan
- **Privacy**: Respecteer privacy en data-bescherming
- **Menselijke autonomie**: Behoud menselijke controle en besluitvorming
- Activiteiten: ethische dilemma-discussies, bias-detectie oefeningen
- Toetsing: reflectie op ethisch AI-gebruik, casestudy analyses
- Focus: responsible AI adoption, ethical decision-making`;
  }

  private parseGeminiResponse(text: string): GeminiResponse {
    try {
      // Clean the response text
      let cleanText = text.trim();
      
      // Remove markdown code blocks if present
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/```json\n?/, '').replace(/\n?```$/, '');
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/```\n?/, '').replace(/\n?```$/, '');
      }

      const parsed = JSON.parse(cleanText);
      
      // Validate required fields
      if (!parsed.newObjective || !parsed.rationale || !parsed.activities || !parsed.assessments) {
        throw new Error('Incomplete response from Gemini');
      }

      return {
        newObjective: parsed.newObjective,
        rationale: parsed.rationale,
        activities: Array.isArray(parsed.activities) ? parsed.activities : [],
        assessments: Array.isArray(parsed.assessments) ? parsed.assessments : []
      };
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      console.log('Raw response:', text);
      
      // Fallback: try to extract information manually
      return this.fallbackParsing(text);
    }
  }

  private fallbackParsing(text: string): GeminiResponse {
    // Simple fallback parsing if JSON parsing fails
    const lines = text.split('\n').filter(line => line.trim());
    
    return {
      newObjective: "AI-ready transformatie kon niet worden gegenereerd volgens de landelijke visie. Probeer het opnieuw.",
      rationale: "Er was een probleem met het verwerken van de AI-response volgens de Nederlandse richtlijnen.",
      activities: ["Probeer de transformatie opnieuw met focus op kansengelijkheid"],
      assessments: ["Controleer de API-verbinding en landelijke visie-integratie"]
    };
  }
}

// Singleton instance
export const geminiService = new GeminiService();