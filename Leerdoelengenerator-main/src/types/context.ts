import type { Education, VoLevel, VSOCluster } from '../constants/education';
export type { Education, VoLevel, VSOCluster };

export interface LearningObjectiveContext {
  original: string;
  education: Education;
  level: string; // unchanged for MBO/HBO/WO/VSO
  domain: string;
  assessment?: string;
  lane?: 'baan1' | 'baan2';
  /**
   * Beschrijft hoe AI in deze taak gebruikt mag worden.
   *
   * - "verboden": AI-gebruik niet toegestaan.
   * - "beperkt": Alleen gecontroleerd/toegestaan onder toezicht.
   * - "toegestaan": AI-gebruik is toegestaan, mits verantwoord.
   * - "verplicht": AI-gebruik is vereist en onderdeel van de taak.
   */
  ai_usage?: 'verboden' | 'beperkt' | 'toegestaan' | 'verplicht';
  /**
   * Transparantie-eisen die de student moet aanleveren als bewijs
   * van verantwoord AI-gebruik (logboek, versiebeheer, reflectie, ...).
   */
  transparency_requirements?: string[];
  /**
   * Ethische aandachtspunten zoals privacy of bias die voor deze
   * taak relevant zijn.
   */
  ethics_flags?: string[];
  /**
   * Informatie voor constructive alignment van het leerdoel.
   * bloomLevel: het niveau in Bloom.
   * context: beschrijving van de taakcontext.
   * constraints: voorwaarden of beperkingen voor de taak.
   */
  alignment?: {
    bloomLevel?: string;
    context?: string;
    constraints?: string;
  };
  voLevel?: VoLevel; // required when education === 'VO'
  voGrade?: number;  // required when education === 'VO'
  vsoCluster?: VSOCluster; // required when education === 'VSO'
}
