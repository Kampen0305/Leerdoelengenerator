import React, { useState } from 'react';

interface FormValues {
  vak: string;
  niveau: 'havo' | 'vwo';
  cohort?: string;
  eindtermen: string;
}

interface Props {
  onSubmit: (vals: FormValues) => void;
}

export function VoBovenbouwForm({ onSubmit }: Props) {
  const [vak, setVak] = useState('');
  const [niveau, setNiveau] = useState<'havo' | 'vwo'>('havo');
  const [cohort, setCohort] = useState('');
  const [eindtermen, setEindtermen] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eindtermen.trim()) {
      alert('Voer minstens één eindterm in.');
      return;
    }
    onSubmit({ vak, niveau, cohort: cohort || undefined, eindtermen });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        value={vak}
        onChange={(e) => setVak(e.target.value)}
        placeholder="Vak"
        required
      />
      <div className="flex gap-4">
        {(['havo', 'vwo'] as const).map((n) => (
          <label key={n} className="inline-flex items-center gap-2">
            <input
              type="radio"
              name="niveau"
              value={n}
              checked={niveau === n}
              onChange={() => setNiveau(n)}
            />
            <span>{n}</span>
          </label>
        ))}
      </div>
      <input
        value={cohort}
        onChange={(e) => setCohort(e.target.value)}
        placeholder="Cohort/syllabus-jaar (optioneel)"
      />
      <textarea
        value={eindtermen}
        onChange={(e) => setEindtermen(e.target.value)}
        placeholder="Plak exacte eindtermen; we herschrijven de bron niet."
        required
      />
      <button type="submit" className="btn">
        Genereer
      </button>
    </form>
  );
}
