import { SuggestionBundle } from '@/types/learning';

export default function Suggestions({ data }: { data: SuggestionBundle }) {
  if (!data) return null;

  const copyActivities = () => {
    const text = data.activities
      .map(a => `${a.title} - ${a.description}${a.duration ? ` (${a.duration})` : ''} (${a.why})`)
      .join('\n');
    navigator.clipboard.writeText(text);
  };

  const copyAssessments = () => {
    const text = data.assessments
      .map(t => `${t.title} - ${t.description} (${t.why})`)
      .join('\n');
    navigator.clipboard.writeText(text);
  };

  return (
    <section className="mt-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Aanbevolen activiteiten</h3>
        <button onClick={copyActivities} className="text-xs text-blue-600">Kopieer</button>
      </div>
      <ul className="list-disc pl-5 space-y-2">
        {data.activities.map((a, i) => (
          <li key={i}>
            <div className="font-medium flex items-center">
              {a.title}
              <span className="ml-2 text-xs text-gray-500" title={a.why}>i</span>
            </div>
            <div className="text-sm opacity-80">{a.description}{a.duration ? ` · ${a.duration}` : ''}</div>
            <div className="text-xs opacity-70 italic">Waarom: {a.why}</div>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between mt-6">
        <h3 className="text-lg font-semibold">Mogelijke toetsvormen</h3>
        <button onClick={copyAssessments} className="text-xs text-blue-600">Kopieer</button>
      </div>
      <ul className="list-disc pl-5 space-y-2">
        {data.assessments.map((t, i) => (
          <li key={i}>
            <div className="font-medium flex items-center">
              {t.title}
              <span className="ml-2 text-xs text-gray-500" title={t.why}>i</span>
            </div>
            <div className="text-sm opacity-80">{t.description}</div>
            <div className="text-xs opacity-70 italic">Waarom: {t.why}</div>
          </li>
        ))}
      </ul>
    </section>
  );
}

