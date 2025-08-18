import React, { useState } from 'react';
import { callLLM, LLMResult } from '../services/llm';

export default function ResultCard() {
  const [original, setOriginal] = useState('');
  const [education, setEducation] = useState('');
  const [level, setLevel] = useState('');
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState<LLMResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    if (!original.trim() || !education.trim() || !level.trim() || !domain.trim()) {
      setError('Vul alle verplichte velden in.');
      return;
    }
    setLoading(true);
    try {
      const res = await callLLM({ original, education, level, domain });
      setResult(res);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Er ging iets mis.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white">
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={original}
          onChange={(e) => setOriginal(e.target.value)}
          placeholder="Origineel leerdoel"
          className="w-full border p-2 rounded"
        />
        <input
          value={education}
          onChange={(e) => setEducation(e.target.value)}
          placeholder="Onderwijs"
          className="w-full border p-2 rounded"
        />
        <input
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          placeholder="Niveau"
          className="w-full border p-2 rounded"
        />
        <input
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="Domein"
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Bezig...' : 'Genereer'}
        </button>
      </form>

      {error && <p className="mt-4 text-red-700">{error}</p>}

      {result && (
        <div className="mt-4 space-y-2">
          {result.autoFixed && (
            <div className="p-2 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded">
              Automatisch hersteld
            </div>
          )}
          <h3 className="font-semibold text-green-700">{result.data.newObjective}</h3>
          <p className="text-gray-700">{result.data.rationale}</p>
          {result.data.activities.length > 0 && (
            <div>
              <p className="font-medium">Activiteiten:</p>
              <ul className="list-disc list-inside">
                {result.data.activities.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          )}
          {result.data.assessments.length > 0 && (
            <div>
              <p className="font-medium">Toetsing:</p>
              <ul className="list-disc list-inside">
                {result.data.assessments.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
