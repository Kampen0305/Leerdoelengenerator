import type { LearningObjectiveContext } from '../types/context';

export interface TwoLaneOutput {
  objective: string;
  explanation: string;
  rubric: string[];
  verification: string[];
  aiUsage: 'verboden' | 'beperkt' | 'toegestaan' | 'verplicht';
  transparencyRequirements: string[];
  ethicsFlags: string[];
}

// Standaard transparantie-eisen voor Baan 2
const DEFAULT_TRANSPARENCY = [
  'Logboek met gebruikte AI-tools (naam/versie), prompts en tijdstempels',
  'Annotaties op AI-bijdragen in het product (wat is AI, wat is eigen werk)',
  'Kritische evaluatie van AI-output en aangebrachte correcties',
  'Reflectie op leren met AI (zonder en met AI, strategieën)',
];

// Standaard ethische aandachtspunten
const DEFAULT_ETHICS = ['privacy', 'bias', 'bronvermelding'];

/**
 * Genereer leerdoel + uitleg + rubric volgens Two-Lane benadering.
 * Deze logica is bewust eenvoudig en sjabloongebaseerd zodat hij
 * deterministisch werkt in tests zonder LLM.
 */
export function generateTwoLaneOutput(ctx: LearningObjectiveContext): TwoLaneOutput {
  const lane = ctx.lane === 'baan2' ? 'baan2' : 'baan1';
  let aiUsage: 'verboden' | 'beperkt' | 'toegestaan' | 'verplicht';
  if (lane === 'baan2') {
    // In baan 2 mag AI altijd worden ingezet; alleen 'verplicht' blijft expliciet verplicht
    aiUsage = ctx.ai_usage === 'verplicht' ? 'verplicht' : 'toegestaan';
  } else {
    aiUsage = ctx.ai_usage ?? 'beperkt';
  }

  if (lane === 'baan1') {
    const objective = `Na afloop van deze les kan de student, zonder AI, ${ctx.original}`;
    const explanation =
      'Deze taak vindt plaats onder toezicht en meet individuele bekwaamheid; AI-gebruik is beperkt of niet toegestaan.';
    const rubric = [
      'Kerntaak/vaardigheid',
      'Veiligheid & hygiëne',
      'Tijd & nauwkeurigheid',
      'Vakkennis & begrip',
      'Professionaliteit & ethiek (AI-vrij)',
    ];
    return {
      objective,
      explanation,
      rubric,
      verification: [],
      aiUsage,
      transparencyRequirements: [],
      ethicsFlags: ctx.ethics_flags ?? [],
    };
  }

  // Baan 2
  const transparency = ctx.transparency_requirements && ctx.transparency_requirements.length > 0
    ? ctx.transparency_requirements
    : DEFAULT_TRANSPARENCY;

  const objective =
    `Na afloop van deze les kan de student, met doelmatig en verantwoord gebruik van AI (${aiUsage}), ${ctx.original}, ` +
    'AI-output beoordelen op juistheid/bias, keuzes verantwoorden en het leerproces transparant maken via logboek.';

  const explanation =
    'AI is toegestaan of vereist; de student toont transparantie, verantwoording en reflectie en houdt rekening met privacy/AVG en AI Act.';

  const rubric = [
    'Resultaatkwaliteit in context',
    'AI-geletterdheid (keuze, promptkwaliteit, evaluatie)',
    'Transparantie & verantwoording',
    'Ethiek/AVG/AI-Act alertheid',
    'Reflectie op leerproces',
  ];

  return {
    objective,
    explanation,
    rubric,
    verification: transparency,
    aiUsage,
    transparencyRequirements: transparency,
    ethicsFlags: ctx.ethics_flags ?? DEFAULT_ETHICS,
  };
}

export default generateTwoLaneOutput;
