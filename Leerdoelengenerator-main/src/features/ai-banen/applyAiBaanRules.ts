import type { AiBaanSettings } from '../../lib/standards/types';

interface Section {
  content: string[];
}

export function applyAiBaanRules(sections: Section, settings: AiBaanSettings): Section {
  if (settings.baan === 2) {
    return {
      content: [
        ...sections.content,
        'Transparantie: documenteer wat, wanneer en hoe AI is gebruikt.',
        'Procesbewijzen: bewaar versies en logboeken.',
        'Reflectie: beschrijf de rol van AI en mogelijke bias.',
      ],
    };
  }
  return sections;
}
