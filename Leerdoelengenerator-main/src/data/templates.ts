// ===== BEGIN: VOORBEELDEN PER SECTOR =====
import { TemplateItem } from '../types';

export const templates: TemplateItem[] = [
  // --- PO (FUNDEREND) ---
  {
    id: 'po-tekst-feedback',
    titel: 'PO • Creatieve tekst + AI-feedback',
    sector: 'PO',
    onderwijsType: 'FUNDEREND',
    leergebied: 'DG',
    niveau: 'PO',
    kwaliteit: 90,
    baan: 1,
    origineelLeerdoel: 'De leerling kan een korte creatieve tekst schrijven met een begin, midden en eind.',
    aiReadyLeerdoel: 'De leerling schrijft een korte creatieve tekst en gebruikt een AI-tool voor taaltips; de leerling verwerkt de relevante suggesties en licht dat toe.',
    korteBeschrijving: 'AI als feedbackpartner; nadruk op eigen werk en reflectie (baan 1).'
  },
  {
    id: 'po-burgerschap-nieuws',
    titel: 'PO • Nieuws & nepnieuws met AI',
    sector: 'PO',
    onderwijsType: 'FUNDEREND',
    leergebied: 'BURGERSCHAP',
    niveau: 'PO',
    kwaliteit: 88,
    baan: 1,
    origineelLeerdoel: 'De leerling kan bronnen over een actueel onderwerp vergelijken.',
    aiReadyLeerdoel: 'De leerling vergelijkt nieuwsbronnen, gebruikt AI voor samenvattingen en benoemt eigen checks op betrouwbaarheid en bias.',
    korteBeschrijving: 'Mediawijsheid; AI-inzet transparant en controleerbaar.'
  },

  // --- SO (FUNDEREND) ---
  {
    id: 'so-rekenen-hints',
    titel: 'SO • Rekenroute met AI-hints',
    sector: 'SO',
    onderwijsType: 'FUNDEREND',
    leergebied: 'ALGEMEEN',
    niveau: 'SO',
    kwaliteit: 86,
    baan: 1,
    origineelLeerdoel: 'De leerling kan een meerstaps rekenopgave oplossen.',
    aiReadyLeerdoel: 'De leerling lost een meerstapsopgave op en gebruikt indien nodig AI-hints; de leerling legt de gekozen stappen zelf uit.',
    korteBeschrijving: 'AI als scaffolding, leren staat centraal.'
  },
  {
    id: 'so-dg-herkennen-ai',
    titel: 'SO • Echt of AI-gegenereerd?',
    sector: 'SO',
    onderwijsType: 'FUNDEREND',
    leergebied: 'DG',
    niveau: 'SO',
    kwaliteit: 84,
    baan: 1,
    origineelLeerdoel: 'De leerling kan digitale beelden beoordelen op echtheid.',
    aiReadyLeerdoel: 'De leerling beoordeelt (AI)beelden en motiveert waarom iets echt of gegenereerd is; benoemt risico’s en veilig gebruik.',
    korteBeschrijving: 'Basis digitale geletterdheid en veiligheid.'
  },

  // --- VSO (FUNDEREND) ---
  {
    id: 'vso-praktisch-plan',
    titel: 'VSO • Praktisch stappenplan met AI',
    sector: 'VSO',
    onderwijsType: 'FUNDEREND',
    leergebied: 'ALGEMEEN',
    niveau: 'VSO',
    kwaliteit: 85,
    baan: 1,
    origineelLeerdoel: 'De leerling kan een praktisch stappenplan volgen.',
    aiReadyLeerdoel: 'De leerling maakt met AI-ondersteuning een passend stappenplan, voert het uit en reflecteert op veiligheid en zelfstandigheid.',
    korteBeschrijving: 'Functioneel en context-nabij.'
  },
  {
    id: 'vso-dg-veiligheid',
    titel: 'VSO • Veilig online met AI-assistent',
    sector: 'VSO',
    onderwijsType: 'FUNDEREND',
    leergebied: 'DG',
    niveau: 'VSO',
    kwaliteit: 83,
    baan: 1,
    origineelLeerdoel: 'De leerling kan veilig onlinegedrag tonen.',
    aiReadyLeerdoel: 'De leerling gebruikt een AI-assistent om risico’s te herkennen (phishing, privacy) en kiest passende acties.',
    korteBeschrijving: 'Veiligheid en zelfregie.'
  },

  // --- VO (FUNDEREND) ---
  {
    id: 'vo-nask-hypothese',
    titel: 'VO • Hypothese toetsen met AI-analyse',
    sector: 'VO',
    onderwijsType: 'FUNDEREND',
    leergebied: 'ALGEMEEN',
    niveau: 'VO onderbouw',
    kwaliteit: 89,
    baan: 1,
    origineelLeerdoel: 'De leerling kan een experiment uitvoeren en resultaten interpreteren.',
    aiReadyLeerdoel: 'De leerling voert een experiment uit, gebruikt AI voor eerste patroonherkenning en controleert/weerlegt met eigen berekeningen.',
    korteBeschrijving: 'AI als hulpmiddel, leerling verantwoordt eigen keuzes.'
  },
  {
    id: 'vo-burgerschap-ai-ethiek',
    titel: 'VO • Debat: AI-ethiek in de samenleving',
    sector: 'VO',
    onderwijsType: 'FUNDEREND',
    leergebied: 'BURGERSCHAP',
    niveau: 'VO onderbouw',
    kwaliteit: 87,
    baan: 1,
    origineelLeerdoel: 'De leerling kan standpunten onderbouwen in een debat.',
    aiReadyLeerdoel: 'De leerling bereidt een debat voor met AI-samenvattingen, controleert bronnen, en verantwoordt de rol van AI in de argumentatie.',
    korteBeschrijving: 'Transparantie over AI-gebruik (baan 1).'
  },

  // --- MBO (BEROEPS) ---
  {
    id: 'mbo-zorg-dilemma',
    titel: 'MBO • Zorg: Praktijksituatie & AI-advies',
    sector: 'MBO',
    onderwijsType: 'BEROEPS',
    leergebied: 'ZORG',
    niveau: 'MBO • Niveau 3-4',
    kwaliteit: 92,
    baan: 2,
    origineelLeerdoel: 'De student kan een zorgplan opstellen voor een cliëntsituatie.',
    aiReadyLeerdoel: 'De student stelt met AI-ondersteuning een zorgplan op, controleert veiligheid/geschiktheid en verantwoordt keuzes volgens richtlijnen.',
    korteBeschrijving: 'AI-geletterd handelen in context (baan 2).'
  },
  {
    id: 'mbo-verkopen-klantgesprek',
    titel: 'MBO • Commercie: Klantgesprek met AI-briefing',
    sector: 'MBO',
    onderwijsType: 'BEROEPS',
    leergebied: 'COMMUNICATIE',
    niveau: 'MBO • Niveau 3',
    kwaliteit: 88,
    baan: 2,
    origineelLeerdoel: 'De student kan een klantgesprek voorbereiden en uitvoeren.',
    aiReadyLeerdoel: 'De student gebruikt AI om een klantbriefing te genereren, checkt juistheid, en voert het gesprek professioneel met eigen documentatie.',
    korteBeschrijving: 'AI als assistent, student beslist.'
  },

  // --- HBO (BEROEPS) ---
  {
    id: 'hbo-dg-data-ethiek',
    titel: 'HBO • DG: Data-ethiek & bronvermelding',
    sector: 'HBO',
    onderwijsType: 'BEROEPS',
    leergebied: 'DG',
    niveau: 'HBO • Ba',
    kwaliteit: 90,
    baan: 2,
    origineelLeerdoel: 'De student kan bronnen verantwoord gebruiken in beroepsproducten.',
    aiReadyLeerdoel: 'De student zet AI in voor literatuurzoektochten, controleert betrouwbaarheid, citeert correct en verantwoordt AI-bijdragen.',
    korteBeschrijving: 'Transparantie conform AI-GO / Npuls.'
  },
  {
    id: 'hbo-project-plannen',
    titel: 'HBO • Projectmanagement met AI-risicoanalyse',
    sector: 'HBO',
    onderwijsType: 'BEROEPS',
    leergebied: 'MANAGEMENT',
    niveau: 'HBO • Ba',
    kwaliteit: 87,
    baan: 2,
    origineelLeerdoel: 'De student kan een projectplan opstellen en uitvoeren.',
    aiReadyLeerdoel: 'De student gebruikt AI voor risico-/planning-suggesties, valideert aannames en stuurt bij met onderbouwde beslissingen.',
    korteBeschrijving: 'AI-assisted, mens beslist.'
  },

  // --- WO (BEROEPS) ---
  {
    id: 'wo-ai-ethiek-paper',
    titel: 'WO • AI-ethiek: position paper + bronkritiek',
    sector: 'WO',
    onderwijsType: 'BEROEPS',
    leergebied: 'BURGERSCHAP',
    niveau: 'WO • Master',
    kwaliteit: 91,
    baan: 2,
    origineelLeerdoel: 'De student kan een academisch betoog schrijven.',
    aiReadyLeerdoel: 'De student gebruikt AI voor concept-tegenargumenten, checkt hallucinaties, en levert een paper met expliciete AI-verantwoording.',
    korteBeschrijving: 'Academische integriteit met AI.'
  },
  {
    id: 'wo-onderzoek-marktdata',
    titel: 'WO • Onderzoek: Marktdata & AI-analyse',
    sector: 'WO',
    onderwijsType: 'BEROEPS',
    leergebied: 'ONDERZOEK',
    niveau: 'WO • Bachelor/Master',
    kwaliteit: 88,
    baan: 2,
    origineelLeerdoel: 'De student kan een marktanalyse uitvoeren.',
    aiReadyLeerdoel: 'De student gebruikt AI voor dataset-opschoning/samenvattingen en voert de kernanalyses en interpretatie zelfstandig en reproduceerbaar uit.',
    korteBeschrijving: 'AI versnelt, student interpreteert.'
  },
];
// ===== END: VOORBEELDEN PER SECTOR =====

