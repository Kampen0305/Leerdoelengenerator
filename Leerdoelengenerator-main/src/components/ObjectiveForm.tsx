import React, { useState } from 'react';
import { objectiveSchema, ObjectiveInput } from '../lib/validation';

interface ObjectiveFormProps {
  onSubmit: (data: ObjectiveInput) => void;
}

type ObjectiveFormState = {
  original: string;
  sector: ObjectiveInput['sector'] | '';
  level: string;
  domain: string;
  assessment: string;
};

type ObjectiveErrors = Partial<Record<keyof ObjectiveInput, string>>;

const emptyForm: ObjectiveFormState = {
  original: '',
  sector: '',
  level: '',
  domain: '',
  assessment: ''
};

export function ObjectiveForm({ onSubmit }: ObjectiveFormProps) {
  const [formData, setFormData] = useState<ObjectiveFormState>(emptyForm);
  const [errors, setErrors] = useState<ObjectiveErrors>({});

  const handleChange = (field: keyof ObjectiveFormState, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = objectiveSchema.safeParse(formData);
    if (result.success) {
      setErrors({});
      onSubmit(result.data);
    } else {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        original: fieldErrors.original?.[0],
        sector: fieldErrors.sector?.[0],
        level: fieldErrors.level?.[0],
        domain: fieldErrors.domain?.[0],
        assessment: fieldErrors.assessment?.[0]
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="original" className="block text-sm font-medium text-gray-700">Oorspronkelijk leerdoel</label>
        <textarea
          id="original"
          value={formData.original}
          onChange={e => handleChange('original', e.target.value)}
          placeholder="Bijv. De student kan een zakelijke e-mail schrijven."
          aria-describedby="original-help"
          className="w-full h-24 px-4 py-3 border border-gray-300 rounded-lg"
        />
        <small id="original-help" className="text-gray-500">Formuleer het huidige leerdoel in één zin.</small>
        {errors.original && <p className="text-red-600 text-sm">{errors.original}</p>}
      </div>

      <div>
        <label htmlFor="sector" className="block text-sm font-medium text-gray-700">Onderwijssector (mbo/hbo/wo)</label>
        <select
          id="sector"
          value={formData.sector}
          onChange={e => handleChange('sector', e.target.value)}
          aria-describedby="sector-help"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
        >
          <option value="">Kies sector</option>
          <option value="mbo">mbo</option>
          <option value="hbo">hbo</option>
          <option value="wo">wo</option>
        </select>
        <small id="sector-help" className="text-gray-500">Kies de onderwijssector.</small>
        {errors.sector && <p className="text-red-600 text-sm">{errors.sector}</p>}
      </div>

      <div>
        <label htmlFor="level" className="block text-sm font-medium text-gray-700">Niveau (mbo 2/3/4…)</label>
        <input
          id="level"
          type="text"
          value={formData.level}
          onChange={e => handleChange('level', e.target.value)}
          placeholder="Bijv. 3"
          aria-describedby="level-help"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
        />
        <small id="level-help" className="text-gray-500">Bij mbo alleen niveau 2, 3 of 4.</small>
        {errors.level && <p className="text-red-600 text-sm">{errors.level}</p>}
      </div>

      <div>
        <label htmlFor="domain" className="block text-sm font-medium text-gray-700">Domein/opleiding</label>
        <input
          id="domain"
          type="text"
          value={formData.domain}
          onChange={e => handleChange('domain', e.target.value)}
          placeholder="Bijv. Marketing"
          aria-describedby="domain-help"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
        />
        <small id="domain-help" className="text-gray-500">Noem het domein of de opleiding.</small>
        {errors.domain && <p className="text-red-600 text-sm">{errors.domain}</p>}
      </div>

      <div>
        <label htmlFor="assessment" className="block text-sm font-medium text-gray-700">Beoogde toetsing (baan 1/baan 2)</label>
        <input
          id="assessment"
          type="text"
          value={formData.assessment}
          onChange={e => handleChange('assessment', e.target.value)}
          placeholder="Bijv. portfolio of examen"
          aria-describedby="assessment-help"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
        />
        <small id="assessment-help" className="text-gray-500">Beschrijf hoe het doel getoetst wordt.</small>
        {errors.assessment && <p className="text-red-600 text-sm">{errors.assessment}</p>}
      </div>

      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Versturen</button>
    </form>
  );
}
