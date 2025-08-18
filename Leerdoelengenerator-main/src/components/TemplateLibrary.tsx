import React, { useState } from 'react';
import { BookOpen, Copy, Star, Filter, Search, X, Award } from 'lucide-react';

interface Template {
  id: string;
  title: string;
  category: string;
  education: string;
  level: string;
  domain: string;
  originalObjective: string;
  aiReadyObjective: string;
  rationale: string;
  activities: string[];
  assessments: string[];
  popularity: number;
  qualityScore: number;
}

interface TemplateLibraryProps {
  onUseTemplate: (template: Template) => void;
  onClose: () => void;
}

export function TemplateLibrary({ onUseTemplate, onClose }: TemplateLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterEducation, setFilterEducation] = useState('');

  const templates: Template[] = [
    {
      id: '1',
      title: 'Zakelijke Communicatie',
      category: 'Communicatie',
      education: 'MBO',
      level: 'Niveau 3',
      domain: 'Secretarieel',
      originalObjective: 'De student kan een zakelijke e-mail schrijven in correct Nederlands.',
      aiReadyObjective: 'De student kan met hulp van AI-tools een zakelijke e-mail maken, de AI-tekst controleren en verbeteren, en zelf de juiste toon kiezen voor de ontvanger.',
      rationale: 'In het werk van secretarieel worden AI-tools steeds gewoner. Studenten moeten leren hoe ze AI kunnen gebruiken als hulpmiddel, maar ook hoe ze de resultaten kunnen controleren.',
      activities: [
        'Probeer verschillende AI-tools uit voor e-mail schrijven',
        'Werk samen met een klasgenoot om AI-teksten te controleren',
        'Oefen met het verbeteren van AI-output',
        'Laat zien hoe je AI hebt gebruikt in je werk'
      ],
      assessments: [
        'Praktijkopdracht waarin je laat zien hoe je AI gebruikt en waarom',
        'Portfolio met voorbeelden van je werk met AI',
        'Gesprek over hoe je AI hebt gebruikt'
      ],
      popularity: 95,
      qualityScore: 88
    },
    {
      id: '2',
      title: 'Marktonderzoek',
      category: 'Onderzoek',
      education: 'HBO',
      level: 'Bachelor',
      domain: 'Marketing',
      originalObjective: 'De student kan een marktanalyse uitvoeren voor een nieuwe product.',
      aiReadyObjective: 'De student kan een marktanalyse maken waarbij AI-tools helpen met data verzamelen, de AI-resultaten controleren op juistheid, en zelf conclusies trekken voor het product.',
      rationale: 'In de moderne beroepspraktijk van marketing wordt AI een belangrijk hulpmiddel. Studenten moeten leren samenwerken met AI-technologie terwijl ze hun eigen vakkennis behouden.',
      activities: [
        'Gebruik verschillende AI-tools voor marktonderzoek en vergelijk de resultaten',
        'Werk in duo\'s om AI-gegenereerde resultaten te evalueren',
        'Voer een analyse uit van AI-output en leg je keuzes uit',
        'Presenteer je werkproces met uitleg over AI-gebruik'
      ],
      assessments: [
        'Praktijkopdracht waarin je het volledige werkproces toont inclusief AI-gebruik',
        'Portfolio met reflectie op AI-inzet en gemaakte keuzes',
        'Gesprek over evaluatie van AI-output'
      ],
      popularity: 88,
      qualityScore: 85
    },
    {
      id: '3',
      title: 'Zorgplan Maken',
      category: 'Zorgverlening',
      education: 'MBO',
      level: 'Niveau 4',
      domain: 'Verpleegkunde',
      originalObjective: 'De student kan een individueel zorgplan opstellen.',
      aiReadyObjective: 'De student kan met hulp van AI-tools een zorgplan maken, de AI-suggesties controleren op veiligheid en geschiktheid, en het plan zelf aanpassen aan de specifieke patiënt.',
      rationale: 'In de zorgverlening worden AI-tools steeds gewoner. Studenten moeten leren hoe ze AI kunnen gebruiken als hulpmiddel, maar ook hoe ze de resultaten kunnen controleren op veiligheid.',
      activities: [
        'Probeer verschillende AI-tools uit voor zorgplanning',
        'Werk samen om AI-suggesties te controleren',
        'Oefen met het aanpassen van AI-output aan patiënten',
        'Bespreek wanneer AI wel en niet handig is in de zorg'
      ],
      assessments: [
        'Praktijkopdracht waarin je laat zien hoe je AI gebruikt voor zorgplanning',
        'Portfolio met voorbeelden van zorgplannen met AI-hulp',
        'Gesprek over veiligheid bij AI-gebruik in de zorg'
      ],
      popularity: 92,
      qualityScore: 90
    },
    {
      id: '4',
      title: 'Website Bouwen',
      category: 'Techniek',
      education: 'MBO',
      level: 'Niveau 4',
      domain: 'ICT',
      originalObjective: 'De student kan een webapplicatie ontwikkelen volgens moderne standaarden.',
      aiReadyObjective: 'De student kan een website maken met hulp van AI-tools voor code schrijven, de AI-code controleren en testen, en zelf verbeteringen maken waar nodig.',
      rationale: 'In de ICT-sector worden AI-tools steeds gewoner voor programmeren. Studenten moeten leren hoe ze AI kunnen gebruiken als hulpmiddel, maar ook hoe ze de code kunnen controleren.',
      activities: [
        'Gebruik AI-tools voor het schrijven van code',
        'Werk samen om AI-gegenereerde code te controleren',
        'Oefen met het testen en verbeteren van AI-code',
        'Leer hoe AI-tools werken en wat hun beperkingen zijn'
      ],
      assessments: [
        'Praktijkopdracht waarin je een werkende website toont met AI-hulp',
        'Portfolio met code-voorbeelden en uitleg over AI-gebruik',
        'Presentatie over je ontwikkelproces'
      ],
      popularity: 90,
      qualityScore: 87
    },
    {
      id: '5',
      title: 'Klantgesprek Voeren',
      category: 'Communicatie',
      education: 'MBO',
      level: 'Niveau 3',
      domain: 'Verkoop',
      originalObjective: 'De student kan een klantgesprek voeren.',
      aiReadyObjective: 'De student kan een klantgesprek voorbereiden met hulp van AI-tools voor klantinformatie, de AI-tips controleren en gebruiken, en zelf het gesprek voeren op een persoonlijke manier.',
      rationale: 'In de verkoop worden AI-tools steeds gewoner voor klantanalyse. Studenten moeten leren hoe ze AI kunnen gebruiken voor voorbereiding, maar het echte gesprek blijft menselijk werk.',
      activities: [
        'Gebruik AI-tools voor klantanalyse en gespreksvoorbereiding',
        'Werk samen om AI-tips te controleren en verbeteren',
        'Oefen gesprekken waarin AI-informatie wordt gebruikt',
        'Bespreek wanneer AI wel en niet handig is bij klantcontact'
      ],
      assessments: [
        'Praktijkopdracht waarin je een klantgesprek voert met AI-voorbereiding',
        'Portfolio met voorbeelden van gespreksvoorbereidingen',
        'Gesprek over hoe AI je werk kan verbeteren'
      ],
      popularity: 85,
      qualityScore: 83
    },
    {
      id: '6',
      title: 'Project Plannen',
      category: 'Management',
      education: 'MBO',
      level: 'Niveau 4',
      domain: 'Bedrijfskunde',
      originalObjective: 'De student kan een project plannen en uitvoeren.',
      aiReadyObjective: 'De student kan een project plannen met hulp van AI-tools voor planning en risico\'s, de AI-suggesties controleren en aanpassen, en zelf het project leiden en bijsturen.',
      rationale: 'In projectmanagement worden AI-tools steeds gewoner voor planning en analyse. Studenten moeten leren hoe ze AI kunnen gebruiken als hulpmiddel, maar zelf de leiding houden.',
      activities: [
        'Gebruik AI-tools voor projectplanning en risicoanalyse',
        'Werk samen om AI-planningen te controleren en verbeteren',
        'Oefen met het bijsturen van projecten met AI-ondersteuning',
        'Bespreek de rol van AI in teamleiding'
      ],
      assessments: [
        'Praktijkopdracht waarin je een project plant en uitvoert met AI-hulp',
        'Portfolio met planningen en evaluaties',
        'Presentatie over projectresultaten en AI-gebruik'
      ],
      popularity: 87,
      qualityScore: 85
    }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.originalObjective.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || template.category === filterCategory;
    const matchesEducation = !filterEducation || template.education === filterEducation;
    
    return matchesSearch && matchesCategory && matchesEducation;
  });

  // Sort by quality score
  const sortedTemplates = filteredTemplates.sort((a, b) => b.qualityScore - a.qualityScore);

  const categories = [...new Set(templates.map(t => t.category))];
  const educationTypes = [...new Set(templates.map(t => t.education))];

  const getQualityColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 75) return 'text-orange-600';
    return 'text-red-600';
  };

  const getQualityBackground = (score: number) => {
    if (score >= 85) return 'bg-green-100';
    if (score >= 75) return 'bg-orange-100';
    return 'bg-red-100';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-green-600 to-orange-500 bg-clip-text text-transparent flex items-center">
            <Award className="w-5 h-5 text-green-600 mr-2" />
            Eenvoudige AI-Ready Templates
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-green-50 to-orange-50">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Zoek eenvoudige templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Alle categorieën</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={filterEducation}
              onChange={(e) => setFilterEducation(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Alle onderwijstypes</option>
              {educationTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {sortedTemplates.map((template) => (
              <div key={template.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.title}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                      <span className="bg-gradient-to-r from-green-100 to-orange-100 text-green-800 px-2 py-1 rounded border border-green-200">
                        {template.category}
                      </span>
                      <span>{template.education} - {template.level}</span>
                      <span>•</span>
                      <span>{template.domain}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-orange-500 fill-current" />
                      <span className="text-sm font-medium text-gray-700">{template.popularity}%</span>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${getQualityBackground(template.qualityScore)}`}>
                      <span className={getQualityColor(template.qualityScore)}>
                        Kwaliteit: {template.qualityScore}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div>
                    <p className="text-sm font-medium text-red-700 mb-1">Origineel leerdoel:</p>
                    <p className="text-sm text-gray-700">{template.originalObjective}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-green-700 mb-1">AI-ready (Eenvoudiger):</p>
                    <p className="text-sm text-gray-700">{template.aiReadyObjective}</p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => onUseTemplate(template)}
                    className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-orange-500 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-orange-600 transition-colors shadow-md hover:shadow-lg"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Gebruik Template</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600 text-center">
            Templates met eenvoudige taal • Geschikt voor alle onderwijsniveaus
          </p>
        </div>
      </div>
    </div>
  );
}