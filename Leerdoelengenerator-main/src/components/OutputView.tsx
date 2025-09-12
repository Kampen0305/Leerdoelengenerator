import type React from 'react';
import { GoalItemHeader } from './GoalItemHeader';
import type { EducationLevel } from '@/types/education';

type OutputResult = { text: string; meta: { level: EducationLevel } };

export function OutputView({ result, onRetry }: { result: OutputResult; onRetry?: () => void }) {
  const { text, meta } = result;
  const hasBasis = /(?:\n|^)Basis:\n- /.test(text);

  if (!hasBasis) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-warning">Basisbronnen ontbreken in de output.</p>
        {onRetry && (
          <button type="button" className="btn btn-warning" onClick={onRetry}>
            Opnieuw genereren
          </button>
        )}
      </div>
    );
  }

  const [content, basisBlock] = text.split(/\nBasis:\n/);
  const basisLines = basisBlock.split(/\n/).filter((l) => l.startsWith('- '));

  return (
    <div className="space-y-4">
      <GoalItemHeader level={meta.level} />
      <pre className="whitespace-pre-wrap">{content}</pre>
      <div>
        <h4 className="font-medium">Basis:</h4>
        <ul className="list-disc list-inside">
          {basisLines.map((line, idx) => (
            <li key={idx}>{line.replace(/^-\s*/, '')}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
