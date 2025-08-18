import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, Award, Target, Users, Shield } from 'lucide-react';

interface QualityCheck {
  id: string;
  title: string;
  description: string;
  status: 'pass' | 'warning' | 'fail' | 'info';
  score: number;
  suggestions?: string[];
  weight: number;
  category: 'ai-integration' | 'equity' | 'ethics' | 'pedagogy';
}

interface QualityCheckerProps {
  objective: string;
  context: {
    education: string;
    level: string;
    domain: string;
    voLevel?: string;
    voGrade?: number;
  };
}

export function QualityChecker({ objective, context }: QualityCheckerProps) {
  const runQualityChecks = (): QualityCheck[] => {
    const checks: QualityCheck[] = [];
    const objectiveLower = objective.toLowerCase();
    const isBasicLevel = context.level?.includes('Niveau 1') || context.level?.includes('Niveau 2');
    const isAdvancedLevel = context.level?.includes('Bachelor') || context.level?.includes('Master');

    // EERLIJKE KANSEN CHECKS (Nederlandse Visie)
    
    // Toegankelijkheid Check
    const hasAccessibilityTerms = objectiveLower.includes('toegankelijk') || objectiveLower.includes('iedereen') ||
                                 objectiveLower.includes('alle studenten') || objectiveLower.includes('inclusief') ||
                                 objectiveLower.includes('diverse') || objectiveLower.includes('verschillende');
    
    checks.push({
      id: 'accessibility',
      title: 'Toegankelijkheid & Inclusiviteit',
      description: 'Kijkt of het leerdoel toegankelijk is voor alle studenten, ongeacht achtergrond',
      status: hasAccessibilityTerms ? 'pass' : 'fail',
      score: hasAccessibilityTerms ? 100 : 20,
      suggestions: hasAccessibilityTerms ? [] : [
        'Voeg "toegankelijk voor alle studenten" toe',
        'Gebruik "rekening houdend met diverse achtergronden"',
        'Gebruik "AI-tools die iedereen kan gebruiken"'
      ],
      weight: 25,
      category: 'equity'
    });

    // Bias-bewustzijn Check
    const hasBiasAwareness = objectiveLower.includes('bias') || objectiveLower.includes('vooroordelen') ||
                            objectiveLower.includes('eerlijk') || objectiveLower.includes('objectief') ||
                            objectiveLower.includes('kritisch evaluer') || objectiveLower.includes('kritisch beoordeelt') ||
                            objectiveLower.includes('controleren');
    
    checks.push({
      id: 'bias-awareness',
      title: 'Vooroordelen herkennen',
      description: 'Controleert of bewustzijn van vooroordelen en bias in AI-systemen wordt geïntegreerd',
      status: hasBiasAwareness ? 'pass' : 'warning',
      score: hasBiasAwareness ? 100 : 40,
      suggestions: hasBiasAwareness ? [] : [
        'Voeg "controleren op vooroordelen" toe',
        'Gebruik "bewustzijn van bias"',
        'Gebruik "eerlijke AI-toepassing"'
      ],
      weight: 20,
      category: 'ethics'
    });

    // Transparantie Check
    const hasTransparency = objectiveLower.includes('transparant') || objectiveLower.includes('uitlegbaar') ||
                           objectiveLower.includes('begrijpt hoe') || objectiveLower.includes('werking') ||
                           objectiveLower.includes('verantwoord') || objectiveLower.includes('uitleggen') ||
                           objectiveLower.includes('toelichting');
    
    checks.push({
      id: 'transparency',
      title: 'Transparantie & Uitlegbaarheid',
      description: 'Kijkt of studenten begrijpen hoe AI-tools werken en beslissingen nemen',
      status: hasTransparency ? 'pass' : 'warning',
      score: hasTransparency ? 100 : 50,
      suggestions: hasTransparency ? [] : [
        'Voeg "begrijpt de werking van AI-tools" toe',
        'Gebruik "transparante verantwoording"',
        'Gebruik "uitlegbare AI-beslissingen"'
      ],
      weight: 15,
      category: 'ethics'
    });

    // AI-Integratie Kwaliteit Check
    const hasAdvancedAITerms = objectiveLower.includes('strategisch') || objectiveLower.includes('integreren') || 
                              objectiveLower.includes('ai-tools') || objectiveLower.includes('ai-ondersteuning');
    const hasBasicAITerms = objectiveLower.includes('ai') || objectiveLower.includes('hulp van');
    
    let aiScore = 0;
    let aiStatus: 'pass' | 'warning' | 'fail' = 'fail';
    let aiSuggestions: string[] = [];

    if (hasAdvancedAITerms) {
      aiScore = 100;
      aiStatus = 'pass';
    } else if (hasBasicAITerms) {
      aiScore = 70;
      aiStatus = 'warning';
      aiSuggestions = ['Gebruik specifiekere AI-terminologie', 'Voeg "strategisch inzetten" toe'];
    } else {
      aiScore = 0;
      aiStatus = 'fail';
      aiSuggestions = ['Voeg expliciete AI-integratie toe', 'Gebruik "AI-tools strategisch inzetten"'];
    }

    checks.push({
      id: 'ai-integration',
      title: 'AI-Integratie Kwaliteit',
      description: 'Kijkt naar de diepte en specificiteit van AI-integratie volgens Nederlandse richtlijnen',
      status: aiStatus,
      score: aiScore,
      suggestions: aiSuggestions,
      weight: 20,
      category: 'ai-integration'
    });

    // Kritisch Denken & Menselijke Autonomie
    const hasCriticalTerms = objectiveLower.includes('kritisch') || objectiveLower.includes('evalueert') ||
                            objectiveLower.includes('beoordeelt') || objectiveLower.includes('valideert') ||
                            objectiveLower.includes('zelfstandig') || objectiveLower.includes('autonoom') ||
                            objectiveLower.includes('controleren');
    
    checks.push({
      id: 'critical-autonomy',
      title: 'Kritisch Denken & Menselijke Autonomie',
      description: 'Controleert of menselijke autonomie en kritische evaluatie behouden blijven',
      status: hasCriticalTerms ? 'pass' : 'fail',
      score: hasCriticalTerms ? 100 : 30,
      suggestions: hasCriticalTerms ? [] : [
        isBasicLevel ? 'Voeg "controleert" of "bekijkt kritisch" toe' : 'Voeg "kritisch evalueert" toe',
        'Gebruik "behoudt menselijke autonomie"',
        'Gebruik "zelfstandige besluitvorming"'
      ],
      weight: 20,
      category: 'pedagogy'
    });

    return checks;
  };

  const checks = runQualityChecks();
  
  // Calculate weighted score
  const totalWeight = checks.reduce((sum, check) => sum + check.weight, 0);
  const weightedScore = Math.round(
    checks.reduce((sum, check) => sum + (check.score * check.weight), 0) / totalWeight
  );

  // Group checks by category
  const checksByCategory = checks.reduce((acc, check) => {
    if (!acc[check.category]) acc[check.category] = [];
    acc[check.category].push(check);
    return acc;
  }, {} as Record<string, QualityCheck[]>);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 85) return 'bg-green-100';
    if (score >= 70) return 'bg-orange-100';
    return 'bg-red-100';
  };

  const getQualityLabel = (score: number) => {
    if (score >= 90) return 'Uitstekend - Voldoet volledig aan Nederlandse visie';
    if (score >= 80) return 'Goed - Grotendeels conform landelijke richtlijnen';
    if (score >= 70) return 'Voldoende - Basis richtlijnen gevolgd';
    if (score >= 60) return 'Matig - Verbeteringen nodig voor compliance';
    return 'Onvoldoende - Niet conform Nederlandse visie';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return null;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'equity':
        return <Users className="w-4 h-4" />;
      case 'ethics':
        return <Shield className="w-4 h-4" />;
      case 'ai-integration':
        return <Award className="w-4 h-4" />;
      case 'pedagogy':
        return <Target className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'equity':
        return 'Eerlijke kansen';
      case 'ethics':
        return 'Ethiek & Transparantie';
      case 'ai-integration':
        return 'AI-Integratie';
      case 'pedagogy':
        return 'Pedagogiek';
      default:
        return 'Overig';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-green-600 to-orange-500 bg-clip-text text-transparent flex items-center">
          <Award className="w-5 h-5 text-green-600 mr-2" />
          Kwaliteitsanalyse volgens Nederlandse Visie
        </h3>
        <div className={`px-6 py-3 rounded-lg ${getScoreBackground(weightedScore)} border-2 ${weightedScore >= 85 ? 'border-green-300' : weightedScore >= 70 ? 'border-orange-300' : 'border-red-300'}`}>
          <div className="text-center">
            <span className={`text-2xl font-bold ${getScoreColor(weightedScore)}`}>
              {weightedScore}%
            </span>
            <div className={`text-xs font-medium ${getScoreColor(weightedScore)} mt-1`}>
              {getQualityLabel(weightedScore)}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(checksByCategory).map(([category, categoryChecks]) => (
          <div key={category} className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              {getCategoryIcon(category)}
              <span className="ml-2">{getCategoryTitle(category)}</span>
            </h4>
            
            <div className="space-y-3">
              {categoryChecks.map((check) => (
                <div key={check.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-3 flex-1">
                      {getStatusIcon(check.status)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h5 className="font-medium text-gray-900">{check.title}</h5>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">Gewicht: {check.weight}%</span>
                            <span className={`text-sm font-medium ${getScoreColor(check.score)}`}>
                              {check.score}%
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{check.description}</p>
                      </div>
                    </div>
                  </div>

                  {check.suggestions && check.suggestions.length > 0 && (
                    <div className="mt-3 pl-8">
                      <p className="text-sm font-medium text-gray-700 mb-1">Verbeteringsuggesties:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {check.suggestions.map((suggestion, idx) => (
                          <li key={idx} className="flex items-start">
                            <Target className="w-3 h-3 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-orange-50 border border-green-200 rounded-lg">
        <h4 className="font-medium text-green-800 mb-2 flex items-center">
          <Shield className="w-4 h-4 mr-2" />
          Nederlandse Visie op AI en Eerlijke kansen
        </h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-green-700">
          <ul className="space-y-1">
            <li>• <strong>Eerlijke kansen (25%):</strong> Toegankelijk voor alle studenten</li>
            <li>• <strong>Vooroordelen herkennen (20%):</strong> Weten wat bias is</li>
            <li>• <strong>AI-integratie (20%):</strong> Strategische en ethische toepassing</li>
          </ul>
          <ul className="space-y-1">
            <li>• <strong>Menselijke autonomie (20%):</strong> Kritisch denken behouden</li>
            <li>• <strong>Transparantie (15%):</strong> Begrijpbare AI-beslissingen</li>
            <li>• <strong>Inclusiviteit:</strong> Verschillende leerbehoeften ondersteunen</li>
          </ul>
        </div>
        
        <div className="mt-3 pt-3 border-t border-green-200">
          <p className="text-sm text-green-700">
            <strong>Landelijke Visie:</strong> AI moet bijdragen aan eerlijke kansen voor alle studenten, 
            ongeacht achtergrond, en ethisch verantwoord worden toegepast in het onderwijs.
          </p>
        </div>
      </div>
    </div>
  );
}