import React, { useState, useEffect } from 'react';
import { BookOpen, Brain, Users, FileText, Download, ChevronRight, Lightbulb, Target, CheckCircle, Upload, Database, ChevronDown, Save, FolderOpen, Library, BarChart3, Shield } from 'lucide-react';
import { KDImport } from './components/KDImport';
import { SavedObjectives } from './components/SavedObjectives';
import { TemplateLibrary } from './components/TemplateLibrary';
import { QualityChecker } from './components/QualityChecker';
import { EducationGuidance } from './components/EducationGuidance';
import { KDStructure } from './types/kd';
import { KDParser } from './utils/kdParser';
import { ExportUtils } from './utils/exportUtils';
import { geminiService } from './services/geminiService';

interface LearningObjective {
  original: string;
  context: {
    education: string;
    level: string;
    domain: string;
    assessment: string;
  };
}

interface AIReadyOutput {
  newObjective: string;
  rationale: string;
  activities: string[];
  assessments: string[];
}

interface SavedObjective {
  id: string;
  originalObjective: string;
  aiReadyObjective: string;
  context: {
    education: string;
    level: string;
    domain: string;
    assessment: string;
  };
  createdAt: string;
  tags: string[];
}

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<LearningObjective>({
    original: '',
    context: {
      education: '',
      level: '',
      domain: '',
      assessment: ''
    }
  });
  const [output, setOutput] = useState<AIReadyOutput | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showKDImport, setShowKDImport] = useState(false);
  const [showSavedObjectives, setShowSavedObjectives] = useState(false);
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [importedKD, setImportedKD] = useState<KDStructure | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showQualityChecker, setShowQualityChecker] = useState(false);
  const [showEducationGuidance, setShowEducationGuidance] = useState(false);

  const educationTypes = ['MBO', 'HBO', 'WO'];
  const levels = {
    'MBO': ['Niveau 1', 'Niveau 2', 'Niveau 3', 'Niveau 4'],
    'HBO': ['Bachelor', 'Associate Degree'],
    'WO': ['Bachelor', 'Master']
  };

  const examples = [
    {
      original: "De student kan een zakelijke e-mail schrijven in correct Nederlands.",
      context: "MBO niveau 3, secretarieel medewerker",
      newObjective: "De student kan met hulp van AI-tools een zakelijke e-mail maken, de AI-tekst controleren en verbeteren, en zelf de juiste toon kiezen voor de ontvanger."
    },
    {
      original: "De student kan een marktanalyse uitvoeren voor een nieuwe product.",
      context: "HBO Bachelor, Marketing",
      newObjective: "De student kan een marktanalyse maken waarbij AI-tools helpen met data verzamelen, de AI-resultaten controleren op juistheid, en zelf conclusies trekken voor het product."
    }
  ];

  // Validate form data before transformation
  const isFormDataComplete = () => {
    return formData.original && 
           formData.original.trim() !== '' &&
           formData.context.education && 
           formData.context.education.trim() !== '' &&
           formData.context.level && 
           formData.context.level.trim() !== '' &&
           formData.context.domain && 
           formData.context.domain.trim() !== '';
  };

  // Auto-start transformation when reaching step 2 (with validation)
  useEffect(() => {
    if (currentStep === 2 && !isProcessing && !output) {
      console.log('🔍 Debug Info - Starting transformation:');
      console.log('- Current step:', currentStep);
      console.log('- Is processing:', isProcessing);
      console.log('- Has output:', !!output);
      console.log('- Gemini service available:', geminiService.isAvailable());
      console.log('- Form data:', formData);
      console.log('- Form data complete:', isFormDataComplete());
      
      // Only start transformation if form data is complete
      if (isFormDataComplete()) {
        transformToAIReady();
      } else {
        console.warn('⚠️ Form data incomplete, cannot start transformation');
        console.log('Missing fields:', {
          original: !formData.original || formData.original.trim() === '',
          education: !formData.context.education || formData.context.education.trim() === '',
          level: !formData.context.level || formData.context.level.trim() === '',
          domain: !formData.context.domain || formData.context.domain.trim() === ''
        });
        // Go back to step 1 if data is incomplete
        setCurrentStep(1);
      }
    }
  }, [currentStep, isProcessing, output, formData]);

  // Auto-fill context when KD is imported
  useEffect(() => {
    if (importedKD && formData.original) {
      const contextInfo = KDParser.extractContextForObjective(importedKD, formData.original);
      
      setFormData(prev => ({
        ...prev,
        context: {
          ...prev.context,
          education: importedKD.metadata.level.includes('MBO') ? 'MBO' : 
                    importedKD.metadata.level.includes('HBO') ? 'HBO' : 'WO',
          level: importedKD.metadata.level,
          domain: importedKD.metadata.sector,
        }
      }));
    }
  }, [importedKD, formData.original]);

  const transformToAIReady = async () => {
    console.log('🚀 transformToAIReady called');
    
    // Double-check form data before proceeding
    if (!isFormDataComplete()) {
      console.error('❌ Cannot transform: form data is incomplete');
      setCurrentStep(1);
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Try to use Gemini API first if available
      if (geminiService.isAvailable()) {
        console.log('✅ Using Gemini API for transformation');
        const kdContext = importedKD ? {
          title: importedKD.metadata.title,
          code: importedKD.metadata.code,
          relatedCompetencies: KDParser.extractContextForObjective(importedKD, formData.original).relatedCompetencies,
          relatedWorkProcesses: KDParser.extractContextForObjective(importedKD, formData.original).relatedWorkProcesses
        } : undefined;

        const geminiResponse = await geminiService.generateAIReadyObjective(formData, kdContext);
        setOutput(geminiResponse);
        console.log('✅ Gemini transformation completed successfully');
      } else {
        console.log('⚠️ Gemini API not available, using fallback generation');
        // Fallback to local generation with enhanced Dutch vision integration
        const aiOutput: AIReadyOutput = {
          newObjective: generateAIReadyObjective(formData),
          rationale: generateRationale(formData),
          activities: generateActivities(formData),
          assessments: generateAssessments(formData)
        };
        setOutput(aiOutput);
        console.log('✅ Fallback transformation completed');
      }
      
      setCurrentStep(3);
    } catch (error) {
      console.error('❌ Error generating AI-ready objective:', error);
      
      // Fallback to local generation on error
      console.log('⚠️ Falling back to local generation due to error');
      const aiOutput: AIReadyOutput = {
        newObjective: generateAIReadyObjective(formData),
        rationale: generateRationale(formData),
        activities: generateActivities(formData),
        assessments: generateAssessments(formData)
      };
      setOutput(aiOutput);
      setCurrentStep(3);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateAIReadyObjective = (data: LearningObjective): string => {
    const originalObjective = data.original || '';
    const baseObjective = originalObjective.toLowerCase();
    
    // Enhanced AI-ready transformation with Dutch vision integration
    let kdContext = '';
    if (importedKD) {
      const contextInfo = KDParser.extractContextForObjective(importedKD, originalObjective);
      if (contextInfo.relatedCompetencies.length > 0) {
        kdContext = ` binnen de competentie "${contextInfo.relatedCompetencies[0].title}"`;
      }
    }
    
    // Enhanced transformation based on Dutch national vision
    const equityTerms = 'AI-tools die iedereen kan gebruiken';
    const ethicsTerms = 'controleren of de AI eerlijk is';
    const transparencyTerms = 'uitleggen hoe AI is gebruikt';
    const autonomyTerms = 'zelf';
    
    if (baseObjective.includes('schrijven') || baseObjective.includes('tekst') || baseObjective.includes('communicatie')) {
      return `De student kan met hulp van ${equityTerms} ${originalObjective.replace(/^De student kan /, '').toLowerCase()}, de AI-tekst ${ethicsTerms}, en de uiteindelijke versie ${autonomyTerms} verbeteren met ${transparencyTerms} binnen de ${data.context.domain} context${kdContext}.`;
    } else if (baseObjective.includes('analyse') || baseObjective.includes('onderzoek') || baseObjective.includes('data')) {
      return `De student kan ${originalObjective.replace(/^De student kan /, '').toLowerCase()} waarbij AI-tools helpen met data verzamelen, de AI-resultaten ${ethicsTerms}, en ${autonomyTerms} conclusies trekken die eerlijk zijn binnen de ${data.context.domain}${kdContext}.`;
    } else if (baseObjective.includes('ontwerp') || baseObjective.includes('creëren') || baseObjective.includes('maken')) {
      return `De student kan ${originalObjective.replace(/^De student kan /, '').toLowerCase()} met hulp van ${equityTerms} voor ideeën, de AI-suggesties ${ethicsTerms}, en het eindresultaat ${autonomyTerms} maken met ${transparencyTerms} binnen de ${data.context.domain}${kdContext}.`;
    } else {
      return `De student kan ${originalObjective.replace(/^De student kan /, '').toLowerCase()} met hulp van ${equityTerms}, de AI-output ${ethicsTerms}, en ${autonomyTerms} tot een goede uitvoering komen met ${transparencyTerms} binnen de ${data.context.domain} context${kdContext}.`;
    }
  };

  const generateRationale = (data: LearningObjective): string => {
    const educationLevel = data.context.education;
    const domain = data.context.domain;
    
    let kdRationale = '';
    if (importedKD) {
      kdRationale = ` Deze aanpassing is gebaseerd op het kwalificatiedossier "${importedKD.metadata.title}" en past bij de competenties en werkprocessen.`;
    }
    
    return `Volgens de Nederlandse visie op AI en eerlijke kansen is het belangrijk dat ${educationLevel}-studenten binnen ${domain} leren werken met AI-technologie op een manier die eerlijke kansen biedt voor alle studenten. Deze aangepaste leeruitkomst zorgt ervoor dat studenten leren AI eerlijk te gebruiken, begrijpen hoe het werkt, en zelf beslissingen blijven nemen. De student ontwikkelt zowel AI-vaardigheden als bewustzijn voor eerlijk AI-gebruik.${kdRationale}`;
  };

  const generateActivities = (data: LearningObjective): string[] => {
    const domain = data.context.domain.toLowerCase();
    const baseActivities = [
      `Gebruik verschillende AI-tools voor ${domain}-taken en kijk of ze eerlijk zijn voor iedereen`,
      'Werk samen om AI-resultaten te controleren op fouten en vooroordelen',
      'Doe een check van AI-output en leg uit welke keuzes je hebt gemaakt',
      'Presenteer je werk en leg uit hoe je AI hebt gebruikt',
      'Denk na over wat goed en fout is bij AI-gebruik in je vakgebied',
      'Maak regels voor goed AI-gebruik die voor iedereen toegankelijk zijn'
    ];
    
    // Add KD-specific activities
    if (importedKD) {
      const contextInfo = KDParser.extractContextForObjective(importedKD, data.original);
      if (contextInfo.relatedWorkProcesses.length > 0) {
        baseActivities.push(`Gebruik eerlijke AI-tools binnen het werkproces "${contextInfo.relatedWorkProcesses[0].title}" zodat iedereen mee kan doen`);
      }
    }
    
    return baseActivities;
  };

  const generateAssessments = (data: LearningObjective): string[] => {
    const level = data.context.level;
    const assessments = [
      'Echte opdracht waarin de student het hele werkproces laat zien inclusief eerlijk AI-gebruik',
      'Portfolio met kritische reflectie over AI-gebruik en eerlijkheid voor iedereen',
      'Gesprek over hoe de student AI-output beoordeelt en verantwoordelijk gebruikt',
      'Peer-review sessies waarbij studenten elkaars werk beoordelen op AI-gebruik en toegankelijkheid',
      'Reflectieverslag over hoe AI kan helpen bij eerlijke kansen in het eigen vakgebied'
    ];
    
    // Add KD-specific assessments
    if (importedKD) {
      assessments.push('Beoordeling volgens de criteria uit het kwalificatiedossier, aangevuld met eerlijke AI-vaardigheden');
    }
    
    return assessments;
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === 'original') {
      setFormData(prev => ({ ...prev, original: value }));
    } else {
      setFormData(prev => ({
        ...prev,
        context: { ...prev.context, [field]: value }
      }));
    }
  };

  const handleKDImported = (kd: KDStructure) => {
    setImportedKD(kd);
  };

  const saveObjective = () => {
    if (!output) return;

    const savedObjective: SavedObjective = {
      id: Date.now().toString(),
      originalObjective: formData.original,
      aiReadyObjective: output.newObjective,
      context: formData.context,
      createdAt: new Date().toISOString(),
      tags: [formData.context.domain, formData.context.education, 'Nederlandse Visie']
    };

    const existing = JSON.parse(localStorage.getItem('savedObjectives') || '[]');
    existing.push(savedObjective);
    localStorage.setItem('savedObjectives', JSON.stringify(existing));

    // Show success message (you could add a toast notification here)
    alert('Leerdoel opgeslagen volgens Nederlandse visie!');
  };

  const loadObjective = (objective: SavedObjective) => {
    setFormData({
      original: objective.originalObjective,
      context: objective.context
    });
    setOutput({
      newObjective: objective.aiReadyObjective,
      rationale: generateRationale({
        original: objective.originalObjective,
        context: objective.context
      }),
      activities: generateActivities({
        original: objective.originalObjective,
        context: objective.context
      }),
      assessments: generateAssessments({
        original: objective.originalObjective,
        context: objective.context
      })
    });
    setCurrentStep(3);
    setShowSavedObjectives(false);
  };

  const useTemplate = (template: any) => {
    setFormData({
      original: template.originalObjective,
      context: {
        education: template.education,
        level: template.level,
        domain: template.domain,
        assessment: ''
      }
    });
    setShowTemplateLibrary(false);
  };

  const getExportData = () => {
    if (!output) return null;
    
    return {
      originalObjective: formData.original,
      context: formData.context,
      aiReadyObjective: output.newObjective,
      rationale: output.rationale,
      suggestedActivities: output.activities,
      suggestedAssessments: output.assessments,
      kdContext: importedKD ? {
        title: importedKD.metadata.title,
        code: importedKD.metadata.code,
        relatedCompetencies: importedKD ? KDParser.extractContextForObjective(importedKD, formData.original).relatedCompetencies : []
      } : null,
      nationalVisionCompliance: true,
      exportDate: new Date().toLocaleDateString('nl-NL'),
      generatedBy: 'DigitEd AI Curriculum Designer v2.0 - Nederlandse Visie'
    };
  };

  const handleExport = (format: 'pdf' | 'word' | 'json') => {
    const exportData = getExportData();
    if (!exportData) return;

    switch (format) {
      case 'pdf':
        ExportUtils.exportToPDF(exportData);
        break;
      case 'word':
        ExportUtils.exportToWord(exportData);
        break;
      case 'json':
        ExportUtils.exportToJSON(exportData);
        break;
    }
    
    setShowExportMenu(false);
  };

  const resetForm = () => {
    setCurrentStep(1);
    setFormData({
      original: '',
      context: {
        education: '',
        level: '',
        domain: '',
        assessment: ''
      }
    });
    setOutput(null);
    setIsProcessing(false);
    setShowQualityChecker(false);
    setShowEducationGuidance(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* DigitEd Logo */}
              <a 
                href="https://www.digited.nl" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center hover:opacity-80 transition-opacity cursor-pointer"
                title="Ga naar DigitEd website"
              >
                <img 
                  src="/logo5.png" 
                  alt="DigitEd Logo" 
                  className="h-12 w-auto"
                />
              </a>
              
              <div className="border-l border-gray-300 pl-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-green-600 to-orange-500 p-2 rounded-lg">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-orange-500 bg-clip-text text-transparent">
                      AI Leerdoelenmaker
                    </h1>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Shield className="w-4 h-4 mr-1 text-green-600" />
                      Maak leerdoelen geschikt voor AI volgens Nederlandse visie op eerlijke kansen
                      {geminiService.isAvailable() && (
                        <span className="ml-2 text-green-600 font-medium">• AI-Enhanced</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {importedKD && (
                <div className="flex items-center space-x-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                  <Database className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">
                    {importedKD.metadata.title}
                  </span>
                </div>
              )}
              
              <button
                onClick={() => setShowTemplateLibrary(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 px-4 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Library className="w-4 h-4" />
                <span>Voorbeelden</span>
              </button>

              <button
                onClick={() => setShowSavedObjectives(true)}
                className="flex items-center space-x-2 bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <FolderOpen className="w-4 h-4" />
                <span>Opgeslagen</span>
              </button>
              
              <button
                onClick={() => setShowKDImport(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 text-white py-2 px-4 rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Upload className="w-4 h-4" />
                <span>KD Importeren</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {[
              { step: 1, title: 'Invoer', icon: FileText },
              { step: 2, title: 'Omzetten', icon: Brain },
              { step: 3, title: 'Resultaat', icon: CheckCircle }
            ].map(({ step, title, icon: Icon }) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                  currentStep >= step 
                    ? 'bg-gradient-to-r from-green-600 to-orange-500 text-white shadow-lg' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`ml-2 font-medium ${
                  currentStep >= step 
                    ? 'bg-gradient-to-r from-green-600 to-orange-500 bg-clip-text text-transparent' 
                    : 'text-gray-500'
                }`}>
                  {title}
                </span>
                {step < 3 && <ChevronRight className="w-4 h-4 text-gray-400 ml-4" />}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Input Form */}
        {currentStep === 1 && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Target className="w-5 h-5 text-green-600 mr-2" />
                  Origineel Leerdoel
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Huidige leeruitkomst *
                    </label>
                    <textarea
                      value={formData.original}
                      onChange={(e) => handleInputChange('original', e.target.value)}
                      placeholder="Bijvoorbeeld: De student kan een zakelijke e-mail schrijven in correct Nederlands."
                      className="w-full h-24 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none transition-all duration-200"
                    />
                    {importedKD && formData.original && (
                      <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-700">
                          <strong>KD Context:</strong> {KDParser.extractContextForObjective(importedKD, formData.original).suggestedContext}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Onderwijstype *
                      </label>
                      <select
                        value={formData.context.education}
                        onChange={(e) => handleInputChange('education', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="">Kies type</option>
                        {educationTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Niveau *
                      </label>
                      <select
                        value={formData.context.level}
                        onChange={(e) => handleInputChange('level', e.target.value)}
                        disabled={!formData.context.education}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50"
                      >
                        <option value="">Kies niveau</option>
                        {formData.context.education && levels[formData.context.education as keyof typeof levels]?.map(level => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vakgebied *
                      </label>
                      <input
                        type="text"
                        value={formData.context.domain}
                        onChange={(e) => handleInputChange('domain', e.target.value)}
                        placeholder="Bijvoorbeeld: Marketing, Zorg, ICT"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Huidige toetsvorm
                      </label>
                      <input
                        type="text"
                        value={formData.context.assessment}
                        onChange={(e) => handleInputChange('assessment', e.target.value)}
                        placeholder="Bijvoorbeeld: Portfolio, Examen"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => setCurrentStep(2)}
                    disabled={!isFormDataComplete()}
                    className="w-full bg-gradient-to-r from-green-600 to-orange-500 text-white py-3 px-6 rounded-lg font-medium hover:from-green-700 hover:to-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg"
                  >
                    Omzetten naar AI-ready onderwijs
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
              </div>
            </div>

            {/* Examples Sidebar */}
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h3 className="font-semibold text-green-800 mb-3 flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2" />
                  Voorbeelden (Nederlandse Visie)
                </h3>
                <div className="space-y-4">
                  {examples.map((example, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-4 border border-green-100">
                      <p className="text-sm text-gray-600 mb-2">{example.context}</p>
                      <p className="text-sm font-medium text-gray-800 mb-2">Origineel:</p>
                      <p className="text-sm text-gray-700 mb-3 italic">"{example.original}"</p>
                      <p className="text-sm font-medium text-green-700 mb-2">AI-ready (Eerlijke kansen):</p>
                      <p className="text-sm text-green-800 italic">"{example.newObjective}"</p>
                    </div>
                  ))}
                </div>
              </div>

              {importedKD && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                  <h3 className="font-semibold text-orange-800 mb-3 flex items-center">
                    <Database className="w-5 h-5 mr-2" />
                    Geïmporteerd KD
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Titel:</strong> {importedKD.metadata.title}</p>
                    <p><strong>Code:</strong> {importedKD.metadata.code}</p>
                    <p><strong>Niveau:</strong> {importedKD.metadata.level}</p>
                    <p><strong>Sector:</strong> {importedKD.metadata.sector}</p>
                    <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-orange-200">
                      <div className="text-center">
                        <div className="font-bold text-orange-700">{importedKD.competencies.length}</div>
                        <div className="text-orange-600 text-xs">Competenties</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-orange-700">{importedKD.workProcesses.length}</div>
                        <div className="text-orange-600 text-xs">Werkprocessen</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-orange-700">{importedKD.learningOutcomes.length}</div>
                        <div className="text-orange-600 text-xs">Leeruitkomsten</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Dutch Vision Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Nederlandse Visie
                </h3>
                <div className="space-y-2 text-sm text-blue-700">
                  <p><strong>Eerlijke kansen:</strong> AI voor alle studenten</p>
                  <p><strong>Vooroordelen herkennen:</strong> Weten wat bias is</p>
                  <p><strong>Duidelijkheid:</strong> Begrijpen hoe AI werkt</p>
                  <p><strong>Ethiek:</strong> AI op een goede manier gebruiken</p>
                  <p><strong>Inclusiviteit:</strong> Verschillende leerbehoeften</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Processing */}
        {currentStep === 2 && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
              <div className="relative w-16 h-16 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-green-200"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-green-600 animate-spin"></div>
                <div className="absolute inset-2 rounded-full border-4 border-orange-200"></div>
                <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-orange-500 animate-spin" style={{ animationDirection: 'reverse' }}></div>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {geminiService.isAvailable() ? 'AI-Enhanced omzetting naar AI-ready onderwijs...' : 'Omzetting naar AI-ready onderwijs...'}
              </h2>
              <p className="text-gray-600 mb-4">
                Uw leerdoel wordt omgezet naar een AI-ready versie die past bij de Nederlandse richtlijnen voor eerlijke kansen en goed AI-gebruik.
              </p>
              <div className="text-sm text-gray-500">
                <p>✓ Het originele leerdoel bekijken</p>
                {importedKD && <p>✓ KD-context en competenties toevoegen</p>}
                {geminiService.isAvailable() && <p>✓ AI-Enhanced niveau-specifieke aanpassingen</p>}
                <p>✓ Eerlijke kansen en vooroordelen-bewustzijn toevoegen</p>
                <p>✓ Duidelijkheid en ethiek waarborgen</p>
                <p>✓ Inclusieve leeractiviteiten maken</p>
                <p>✓ Eerlijke toetsvormen opstellen</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Results */}
        {currentStep === 3 && output && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-orange-500 bg-clip-text text-transparent flex items-center">
                <Shield className="w-6 h-6 text-green-600 mr-2" />
                AI-Ready Leeruitkomst (Nederlandse Visie)
                {geminiService.isAvailable() && (
                  <span className="text-sm font-normal text-green-600 ml-2">• AI-Enhanced</span>
                )}
              </h2>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowEducationGuidance(!showEducationGuidance)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Handreikingen</span>
                </button>

                <button
                  onClick={() => setShowQualityChecker(!showQualityChecker)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 px-4 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Kwaliteit</span>
                </button>

                <button
                  onClick={saveObjective}
                  className="flex items-center space-x-2 bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Save className="w-4 h-4" />
                  <span>Opslaan</span>
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowExportMenu(!showExportMenu)}
                    className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 text-white py-2 px-4 rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <Download className="w-4 h-4" />
                    <span>Downloaden</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  
                  {showExportMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                      <div className="py-1">
                        <button
                          onClick={() => handleExport('pdf')}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        >
                          <FileText className="w-4 h-4 mr-2 text-red-500" />
                          PDF Document
                        </button>
                        <button
                          onClick={() => handleExport('word')}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        >
                          <FileText className="w-4 h-4 mr-2 text-blue-500" />
                          Word Document
                        </button>
                        <button
                          onClick={() => handleExport('json')}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        >
                          <FileText className="w-4 h-4 mr-2 text-gray-500" />
                          JSON Data
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={resetForm}
                  className="flex items-center space-x-2 bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <span>Nieuw Leerdoel</span>
                </button>
              </div>
            </div>

            {/* Education Guidance */}
            {showEducationGuidance && (
              <EducationGuidance 
                context={formData.context}
                aiReadyObjective={output.newObjective}
              />
            )}

            {/* Quality Checker */}
            {showQualityChecker && (
              <QualityChecker 
                objective={output.newObjective} 
                context={formData.context} 
              />
            )}

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Original vs New */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Vergelijking</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm font-medium text-red-800 mb-2">Origineel:</p>
                    <p className="text-red-700">{formData.original}</p>
                  </div>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-medium text-green-800 mb-2">AI-ready (Nederlandse Visie):</p>
                    <p className="text-green-700">{output.newObjective}</p>
                  </div>
                </div>
              </div>

              {/* Rationale */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <BookOpen className="w-5 h-5 text-green-600 mr-2" />
                  Uitleg (Eerlijke kansen)
                </h3>
                <p className="text-gray-700 leading-relaxed">{output.rationale}</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Learning Activities */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Users className="w-5 h-5 text-green-600 mr-2" />
                  Inclusieve Leeractiviteiten
                </h3>
                <ul className="space-y-3">
                  {output.activities.map((activity, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-green-600">{idx + 1}</span>
                      </div>
                      <p className="text-gray-700 text-sm">{activity}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Assessment Forms */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="w-5 h-5 text-orange-500 mr-2" />
                  Eerlijke Toetsvormen
                </h3>
                <ul className="space-y-3">
                  {output.assessments.map((assessment, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-orange-600">{idx + 1}</span>
                      </div>
                      <p className="text-gray-700 text-sm">{assessment}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showKDImport && (
        <KDImport
          onKDImported={handleKDImported}
          onClose={() => setShowKDImport(false)}
        />
      )}

      {showSavedObjectives && (
        <SavedObjectives
          onLoadObjective={loadObjective}
          onClose={() => setShowSavedObjectives(false)}
        />
      )}

      {showTemplateLibrary && (
        <TemplateLibrary
          onUseTemplate={useTemplate}
          onClose={() => setShowTemplateLibrary(false)}
        />
      )}

      {/* Click outside to close export menu */}
      {showExportMenu && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => setShowExportMenu(false)}
        />
      )}
    </div>
  );
}

export default App;