import React, { useState } from 'react';
import { BookOpen, Users, Target, CheckCircle, ChevronDown, ChevronUp, Lightbulb, AlertTriangle, Star, ArrowRight } from 'lucide-react';

interface EducationGuidanceProps {
  context: {
    education: string;
    level: string;
    domain: string;
    voLevel?: string;
    voGrade?: number;
  };
  aiReadyObjective: string;
}

interface GuidanceSection {
  title: string;
  icon: React.ReactNode;
  content: string[];
  examples: string[];
  tips: string[];
}

export function EducationGuidance({ context, aiReadyObjective }: EducationGuidanceProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['teaching-methods']);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const getGuidanceSections = (): GuidanceSection[] => {
    const isBasicLevel = context.level?.includes('Niveau 1') || context.level?.includes('Niveau 2');
    const isMiddleLevel = context.level?.includes('Niveau 3') || context.level?.includes('Niveau 4') || context.level?.includes('Associate degree');
    const isAdvancedLevel = context.level?.includes('Bachelor') || context.level?.includes('Master');
    const domain = context.domain.toLowerCase();

    return [
      {
        title: 'Lesmethoden & Didactiek',
        icon: <BookOpen className="w-5 h-5" />,
        content: [
          isBasicLevel
            ? 'Gebruik hands-on demonstraties waarbij studenten AI-tools stap voor stap leren gebruiken'
            : isMiddleLevel
              ? 'Focus op begeleide toepassing: laat studenten AI inzetten voor specifieke beroepstaken met directe feedback'
              : 'Integreer AI-tools in bestaande lesmethoden en laat studenten experimenteren',
          'Begin elke les met een korte uitleg over welke AI-tools gebruikt gaan worden en waarom',
          isBasicLevel
            ? 'Werk in kleine groepjes zodat studenten elkaar kunnen helpen'
            : isMiddleLevel
              ? 'Combineer individuele uitvoering met klassikale reflectie op de kwaliteit van de AI-output'
              : 'Stimuleer peer-learning waarbij studenten AI-ervaringen delen',
          'Gebruik de "sandwich-methode": eerst zonder AI, dan met AI, dan reflectie op het verschil',
          isAdvancedLevel
            ? 'Integreer kritische analyse van AI-algoritmes en hun maatschappelijke impact'
            : 'Focus op praktische toepassingen die studenten direct kunnen gebruiken'
        ],
        examples: [
          isBasicLevel
            ? 'Demonstreer ChatGPT voor het schrijven van een e-mail, laat studenten het proberen, bespreek samen de resultaten'
            : isMiddleLevel
              ? 'Laat studenten een concept maken met AI en dit vervolgens zelfstandig verfijnen tot een eindproduct'
              : 'Laat studenten verschillende AI-tools vergelijken voor dezelfde taak',
          domain.includes('zorg')
            ? 'Gebruik AI voor het maken van zorgplannen, maar bespreek altijd de menselijke controle'
            : domain.includes('marketing')
              ? 'Laat AI marketingteksten genereren en laat studenten deze verbeteren'
              : 'Gebruik AI voor brainstorming en laat studenten de ideeën verder uitwerken',
          'Maak gebruik van "AI-vrije zones" waar studenten eerst zelf nadenken',
          isAdvancedLevel
            ? 'Organiseer debatsessies over ethische AI-dilemma\'s in het vakgebied'
            : 'Bespreek samen wanneer AI wel en niet handig is'
        ],
        tips: [
          'Start altijd met eenvoudige AI-tools voordat je complexere introduceer',
          'Zorg dat alle studenten toegang hebben tot dezelfde AI-tools',
          'Maak duidelijke afspraken over wanneer AI wel en niet gebruikt mag worden',
          'Documenteer welke AI-tools gebruikt zijn in opdrachten',
          isBasicLevel
            ? 'Gebruik visuele hulpmiddelen en stap-voor-stap instructies'
            : isMiddleLevel
              ? 'Geef duidelijke kaders (prompts) mee, maar laat ruimte voor eigen invulling'
              : 'Stimuleer experimenteren en leren van fouten'
        ]
      },
      {
        title: 'Leeractiviteiten',
        icon: <Users className="w-5 h-5" />,
        content: [
          'AI-vergelijkingsopdrachten: laat studenten verschillende AI-tools proberen voor dezelfde taak',
          'Bias-detectie oefeningen: zoek vooroordelen in AI-output en bespreek deze',
          'Voor-en-na opdrachten: maak eerst zonder AI, dan met AI, vergelijk de resultaten',
          isBasicLevel
            ? 'Begeleide AI-sessies waarbij de docent meekijkt en helpt'
            : isMiddleLevel
              ? 'Casus-gestuurd onderwijs waarbij AI als hulpmiddel wordt ingezet om een probleem op te lossen'
              : 'Zelfstandige AI-projecten met reflectiemomenten',
          'Peer-review van AI-gebruik: studenten beoordelen elkaars AI-toepassingen',
          'Ethische dilemma-discussies over AI-gebruik in het vakgebied',
          isAdvancedLevel
            ? 'Onderzoeksopdrachten naar AI-trends en ontwikkelingen'
            : 'Praktijkcases waarin AI-tools worden toegepast'
        ],
        examples: [
          domain.includes('zorg')
            ? 'Laat studenten AI gebruiken voor symptoomherkenning, maar bespreek de beperkingen'
            : domain.includes('ict')
              ? 'Gebruik AI voor code-generatie en laat studenten de code controleren en verbeteren'
              : domain.includes('marketing')
                ? 'Genereer marketingcampagnes met AI en pas deze aan voor verschillende doelgroepen'
                : 'Gebruik AI voor tekstschrijving en laat studenten de stijl aanpassen',
          'Organiseer "AI-speed dating" waarbij studenten verschillende tools kort uitproberen',
          'Maak een AI-portfolio waarin studenten hun beste AI-toepassingen verzamelen',
          isBasicLevel
            ? 'Gebruik AI voor het maken van presentaties en laat studenten deze verbeteren'
            : isMiddleLevel
              ? 'Laat studenten de output van AI factchecken aan de hand van betrouwbare bronnen'
              : 'Laat studenten AI-tools evalueren op bruikbaarheid en ethiek',
          'Organiseer groepsopdrachten waarbij elk teamlid een andere AI-tool gebruikt'
        ],
        tips: [
          'Varieer tussen individuele en groepsopdrachten',
          'Zorg voor duidelijke instructies over het gebruik van AI-tools',
          'Bouw reflectiemomenten in na elke AI-activiteit',
          'Documenteer welke AI-tools het beste werken voor welke taken',
          'Maak gebruik van real-world cases uit het vakgebied'
        ]
      },
      {
        title: 'Toetsing & Beoordeling',
        icon: <Target className="w-5 h-5" />,
        content: [
          'Proces-beoordeling: beoordeel niet alleen het eindresultaat, maar ook hoe AI is gebruikt',
          'Portfolio-toetsing: laat studenten hun AI-leerproces documenteren',
          'Reflectieverslagen: studenten schrijven over hun AI-ervaringen en leerpunten',
          isBasicLevel
            ? 'Praktische demonstraties waarbij studenten laten zien wat ze kunnen'
            : isMiddleLevel
              ? 'Productbeoordeling waarbij de student mondeling moet kunnen toelichten welke keuzes (met/zonder AI) zijn gemaakt'
              : 'Peer-assessment waarbij studenten elkaars AI-gebruik beoordelen',
          'Authentieke opdrachten die lijken op echte werksituaties',
          'Combinatie van AI-ondersteunde en AI-vrije toetsen',
          isAdvancedLevel
            ? 'Kritische analyses van AI-systemen en hun maatschappelijke impact'
            : 'Gesprekken over wat studenten hebben geleerd van AI-gebruik'
        ],
        examples: [
          'Laat studenten een werkproces uitvoeren met AI-ondersteuning en dit presenteren',
          'Portfolio met voorbeelden van AI-gebruik en reflectie op de keuzes',
          'Peer-review sessies waarbij studenten elkaars AI-toepassingen beoordelen',
          isBasicLevel
            ? 'Praktijktoets waarbij studenten een taak uitvoeren met AI-hulp'
            : isMiddleLevel
              ? 'Criteriumgericht interview (CGI) over de totstandkoming van het werkstuk'
              : 'Casestudy-analyse waarbij AI-ethiek centraal staat',
          'Groepspresentaties over AI-toepassingen in het vakgebied',
          domain.includes('zorg')
            ? 'Simulatie van patiëntenzorg met AI-ondersteuning'
            : domain.includes('marketing')
              ? 'Ontwikkel een marketingcampagne met AI en presenteer de strategie'
              : 'Maak een product of dienst met AI-hulp en evalueer het proces'
        ],
        tips: [
          'Maak duidelijke beoordelingscriteria voor AI-gebruik',
          'Beoordeel zowel technische vaardigheden als ethische overwegingen',
          'Gebruik rubrics die AI-competenties expliciet benoemen',
          'Geef feedback op het proces, niet alleen op het product',
          'Stimuleer zelfbeoordeling en reflectie'
        ]
      },
      {
        title: 'Praktische Implementatie',
        icon: <CheckCircle className="w-5 h-5" />,
        content: [
          'Start met een AI-readiness check: welke tools zijn beschikbaar?',
          'Maak een AI-gebruik protocol voor de klas',
          'Zorg voor backup-plannen als AI-tools niet werken',
          'Train jezelf als docent in de AI-tools die studenten gaan gebruiken',
          'Creëer een veilige leeromgeving waar fouten maken mag',
          'Stel duidelijke regels op over privacy en data-gebruik',
          isAdvancedLevel
            ? 'Ontwikkel partnerships met bedrijven die AI gebruiken'
            : 'Zorg voor voldoende begeleiding en ondersteuning'
        ],
        examples: [
          'Maak een "AI-toolkit" met de belangrijkste tools voor jouw vakgebied',
          'Organiseer gastlessen van professionals die AI gebruiken in hun werk',
          'Creëer een AI-helpdesk waar studenten terecht kunnen met vragen',
          'Stel een AI-gedragscode op samen met de studenten',
          'Maak gebruik van AI-simulaties en oefenomgevingen',
          isBasicLevel
            ? 'Organiseer "AI-buddies" waarbij studenten elkaar helpen'
            : 'Creëer AI-expertgroepen binnen de klas'
        ],
        tips: [
          'Begin klein en bouw langzaam uit',
          'Evalueer regelmatig wat wel en niet werkt',
          'Deel ervaringen met collega-docenten',
          'Houd bij welke AI-tools het beste werken voor welke doelen',
          'Zorg voor technische ondersteuning als dat nodig is'
        ]
      }
    ];
  };

  const sections = getGuidanceSections();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-green-600 to-orange-500 bg-clip-text text-transparent flex items-center mb-2">
          <Lightbulb className="w-5 h-5 text-green-600 mr-2" />
          Handreikingen voor AI-Ready Onderwijs
        </h3>
        <p className="text-sm text-gray-600">
          Praktische tips voor het implementeren van dit AI-ready leerdoel in {context.education} {context.level} - {context.domain}
        </p>
      </div>

      <div className="space-y-4">
        {sections.map((section, index) => (
          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection(`section-${index}`)}
              className="w-full px-4 py-3 bg-gradient-to-r from-green-50 to-orange-50 border-b border-gray-200 flex items-center justify-between hover:from-green-100 hover:to-orange-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                {section.icon}
                <span className="font-medium text-gray-900">{section.title}</span>
              </div>
              {expandedSections.includes(`section-${index}`) ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>

            {expandedSections.includes(`section-${index}`) && (
              <div className="p-4 space-y-4">
                {/* Content */}
                <div>
                  <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                    <Target className="w-4 h-4 text-green-600 mr-2" />
                    Kernpunten
                  </h5>
                  <ul className="space-y-2">
                    {section.content.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-sm text-gray-700">
                        <ArrowRight className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Examples */}
                <div>
                  <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                    <Star className="w-4 h-4 text-orange-500 mr-2" />
                    Praktijkvoorbeelden
                  </h5>
                  <ul className="space-y-2">
                    {section.examples.map((example, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-sm text-gray-700">
                        <ArrowRight className="w-3 h-3 text-orange-500 mt-0.5 flex-shrink-0" />
                        <span className="italic">{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tips */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h5 className="font-medium text-blue-900 mb-2 flex items-center">
                    <AlertTriangle className="w-4 h-4 text-blue-600 mr-2" />
                    Praktische Tips
                  </h5>
                  <ul className="space-y-1">
                    {section.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-sm text-blue-800">
                        <ArrowRight className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Implementation Timeline */}
      <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-orange-50 border border-green-200 rounded-lg">
        <h4 className="font-medium text-green-800 mb-3 flex items-center">
          <CheckCircle className="w-4 h-4 mr-2" />
          Implementatie Stappenplan
        </h4>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white rounded-lg p-3 border border-green-200">
            <div className="font-medium text-green-700 mb-1">Week 1-2: Voorbereiding</div>
            <ul className="text-green-600 space-y-1">
              <li>• AI-tools uitproberen</li>
              <li>• Lesmateriaal aanpassen</li>
              <li>• Regels opstellen</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-3 border border-orange-200">
            <div className="font-medium text-orange-700 mb-1">Week 3-6: Introductie</div>
            <ul className="text-orange-600 space-y-1">
              <li>• Eerste AI-activiteiten</li>
              <li>• Begeleide oefeningen</li>
              <li>• Reflectiemomenten</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-3 border border-blue-200">
            <div className="font-medium text-blue-700 mb-1">Week 7+: Verdieping</div>
            <ul className="text-blue-600 space-y-1">
              <li>• Zelfstandig AI-gebruik</li>
              <li>• Complexere opdrachten</li>
              <li>• Evaluatie en bijstelling</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}