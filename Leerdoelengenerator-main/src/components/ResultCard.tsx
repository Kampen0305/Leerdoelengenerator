import React from 'react';
import type { PostProcessedResponse } from '../lib/format';
import { formatBloom } from '../utils/bloom';

interface ResultCardProps {
  result?: PostProcessedResponse;
  error?: string;
  onSave?: () => void;
}

/**
 * Toont de gegenereerde leerdoelinformatie en eventuele foutmeldingen.
 */
export const ResultCard: React.FC<ResultCardProps> = ({ result, error, onSave }) => {
  if (error) {
    return (
      <div className="p-4 bg-accent-pop/10 border border-accent-pop/20 rounded text-accent-pop">
        {error}
      </div>
    );
  }

  if (!result) return null;

  const autoFixed = result.warnings.includes('Automatisch hersteld');
  const remainingWarnings = result.warnings.filter(w => w !== 'Automatisch hersteld');
  const isIncomplete = !result.newObjective || !result.rationale;
  const bloom = formatBloom(result.bloom);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
      {autoFixed && (
        <div className="mb-3 p-2 bg-accent/10 border border-accent/20 text-accent rounded">
          Automatisch hersteld
        </div>
      )}

      <h3 className="font-semibold text-gray-900 mb-2">AI-ready leerdoel</h3>
      <p className="text-gray-700 mb-4">{result.newObjective}</p>
      {bloom && (
        <p className="text-gray-700 mb-4">
          <strong>{bloom.label}</strong> — {bloom.description}
        </p>
      )}

      <h4 className="font-medium text-gray-900 mb-1">Rationale</h4>
      <p className="text-gray-700 mb-4">{result.rationale}</p>

      {remainingWarnings.length > 0 && (
        <ul className="mb-4 p-2 bg-accent/10 border border-accent/20 rounded text-accent text-sm list-disc list-inside">
          {remainingWarnings.map((w, idx) => (
            <li key={idx}>{w}</li>
          ))}
        </ul>
      )}

      {onSave && (
        <button
          onClick={onSave}
          disabled={isIncomplete}
          className="mt-2 bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-lg hover:shadow-md transition-all disabled:opacity-50"
        >
          Opslaan
        </button>
      )}
      {onSave && isIncomplete && (
        <p className="text-sm text-accent-pop mt-2">Vul alle velden in.</p>
      )}
    </div>
  );
};

export default ResultCard;
