import { KDStructure, KDParseResult, Competency, WorkProcess, LearningOutcome } from '../types/kd';

export class KDParser {
  static parseFromText(content: string): KDParseResult {
    try {
      // Try to parse as JSON first
      if (content.trim().startsWith('{')) {
        return this.parseJSON(content);
      }
      
      // Parse as structured text
      return this.parseStructuredText(content);
    } catch (error) {
      return {
        success: false,
        error: 'Kon het KD-bestand niet verwerken. Controleer het formaat.',
        suggestions: [
          'Zorg dat het bestand in JSON-formaat is',
          'Of gebruik een gestructureerd tekstformaat',
          'Controleer of alle verplichte velden aanwezig zijn'
        ]
      };
    }
  }

  private static parseJSON(content: string): KDParseResult {
    try {
      const data = JSON.parse(content);
      
      // Validate required fields
      if (!data.metadata || !data.metadata.title) {
        throw new Error('Metadata ontbreekt');
      }

      const kdStructure: KDStructure = {
        metadata: {
          title: data.metadata.title || 'Onbekend KD',
          code: data.metadata.code || 'ONBEKEND',
          level: data.metadata.level || 'Niveau onbekend',
          sector: data.metadata.sector || 'Sector onbekend',
          version: data.metadata.version || '1.0'
        },
        competencies: data.competencies || [],
        workProcesses: data.workProcesses || [],
        learningOutcomes: data.learningOutcomes || []
      };

      return {
        success: true,
        data: kdStructure
      };
    } catch (error) {
      return {
        success: false,
        error: 'JSON-formaat is ongeldig'
      };
    }
  }

  private static parseStructuredText(content: string): KDParseResult {
    const lines = content.split('\n').map(line => line.trim()).filter(line => line);
    
    const kdStructure: KDStructure = {
      metadata: {
        title: 'Geïmporteerd KD',
        code: 'IMPORT',
        level: 'Onbekend',
        sector: 'Onbekend',
        version: '1.0'
      },
      competencies: [],
      workProcesses: [],
      learningOutcomes: []
    };

    let currentSection = '';
    let currentItem: any = null;

    for (const line of lines) {
      // Detect sections
      if (line.toLowerCase().includes('competentie') && line.includes(':')) {
        currentSection = 'competencies';
        currentItem = {
          id: `comp_${kdStructure.competencies.length + 1}`,
          title: line.split(':')[1]?.trim() || line,
          description: '',
          level: kdStructure.metadata.level,
          workProcesses: []
        };
        continue;
      }

      if (line.toLowerCase().includes('werkproces') && line.includes(':')) {
        currentSection = 'workProcesses';
        currentItem = {
          id: `wp_${kdStructure.workProcesses.length + 1}`,
          title: line.split(':')[1]?.trim() || line,
          description: '',
          activities: [],
          competencyIds: []
        };
        continue;
      }

      if (line.toLowerCase().includes('leeruitkomst') && line.includes(':')) {
        currentSection = 'learningOutcomes';
        currentItem = {
          id: `lo_${kdStructure.learningOutcomes.length + 1}`,
          title: line.split(':')[1]?.trim() || line,
          description: '',
          competencyId: '',
          workProcessId: '',
          assessmentCriteria: [],
          context: ''
        };
        continue;
      }

      // Add content to current item
      if (currentItem && line) {
        if (currentSection === 'competencies') {
          if (!currentItem.description) {
            currentItem.description = line;
          } else {
            currentItem.description += ' ' + line;
          }
        } else if (currentSection === 'workProcesses') {
          if (!currentItem.description) {
            currentItem.description = line;
          } else {
            currentItem.activities.push(line);
          }
        } else if (currentSection === 'learningOutcomes') {
          if (!currentItem.description) {
            currentItem.description = line;
          } else {
            currentItem.assessmentCriteria.push(line);
          }
        }
      }

      // Save completed item when starting new section or at end
      if ((line.includes(':') && currentItem) || lines.indexOf(line) === lines.length - 1) {
        if (currentSection === 'competencies' && currentItem) {
          kdStructure.competencies.push(currentItem);
        } else if (currentSection === 'workProcesses' && currentItem) {
          kdStructure.workProcesses.push(currentItem);
        } else if (currentSection === 'learningOutcomes' && currentItem) {
          kdStructure.learningOutcomes.push(currentItem);
        }
      }
    }

    return {
      success: true,
      data: kdStructure
    };
  }

  static extractContextForObjective(kd: KDStructure, objectiveText: string): {
    relatedCompetencies: Competency[];
    relatedWorkProcesses: WorkProcess[];
    suggestedContext: string;
  } {
    const objectiveLower = objectiveText.toLowerCase();
    
    // Find related competencies
    const relatedCompetencies = kd.competencies.filter(comp => 
      objectiveLower.includes(comp.title.toLowerCase()) ||
      comp.description.toLowerCase().includes(objectiveLower.split(' ')[0]) ||
      comp.description.toLowerCase().includes(objectiveLower.split(' ')[1])
    );

    // Find related work processes
    const relatedWorkProcesses = kd.workProcesses.filter(wp =>
      objectiveLower.includes(wp.title.toLowerCase()) ||
      wp.activities.some(activity => 
        activity.toLowerCase().includes(objectiveLower.split(' ')[0])
      )
    );

    // Generate context suggestion
    let suggestedContext = `${kd.metadata.title} (${kd.metadata.code})`;
    if (relatedCompetencies.length > 0) {
      suggestedContext += ` - ${relatedCompetencies[0].title}`;
    }
    if (relatedWorkProcesses.length > 0) {
      suggestedContext += ` - ${relatedWorkProcesses[0].title}`;
    }

    return {
      relatedCompetencies,
      relatedWorkProcesses,
      suggestedContext
    };
  }
}