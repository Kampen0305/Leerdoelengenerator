import React, { useState } from 'react';
import { objectiveSchema, ObjectiveInput } from '../lib/validation';
import PrivacyNote from './PrivacyNote';

interface ObjectiveFormProps {
  onSubmit: (data: ObjectiveInput) => void;
}

type ObjectiveFormState = {
  original: string;
  education: ObjectiveInput['education'] | '';
  level: string;
  domain: string;
  assessment: string;
  voLevel: ObjectiveInput['voLevel'] | '';
  voGrade: string;
  vsoCluster: string;
};

type ObjectiveErrors = Partial<Record<keyof ObjectiveInput, string>>;

const emptyForm: ObjectiveFormState = {
  original: '',
  education: '',
  level: '',
  domain: '',
  assessment: '',
  voLevel: '',
  voGrade: '',
  vsoCluster: ''
};

export function ObjectiveForm({ onSubmit }: ObjectiveFormProps) {
  const [formData, setFormData] = useState<ObjectiveFormState>(emptyForm);
  const [errors, setErrors] = useState<ObjectiveErrors>({});

  const handleChange = (field: keyof ObjectiveFormState, value: string) => {
    setFormData(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'education') {
        next.level = '';
        next.voLevel = '';
        next.voGrade = '';
        next.vsoCluster = '';
      }
      if (field === 'voLevel') {
        next.voGrade = '';
      }
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToValidate = {
      original: formData.original,
      education: formData.education,
      level: formData.education === 'VO' ? undefined : formData.level || undefined,
      domain: formData.domain,
      assessment: formData.assessment,
      voLevel: formData.education === 'VO' ? (formData.voLevel || undefined) : undefined,
      voGrade: formData.education === 'VO' ? Number(formData.voGrade) : undefined,
      vsoCluster: formData.education === 'VSO' ? (formData.vsoCluster || undefined) : undefined
    };
    const result = objectiveSchema.safeParse(dataToValidate);
    if (result.success) {
      setErrors({});
      onSubmit(result.data);
    } else {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        original: fieldErrors.original?.[0],
        education: fieldErrors.education?.[0],
        level: fieldErrors.level?.[0],
        domain: fieldErrors.domain?.[0],
        assessment: fieldErrors.assessment?.[0],
        voLevel: fieldErrors.voLevel?.[0],
        voGrade: fieldErrors.voGrade?.[0],
        vsoCluster: fieldErrors.vsoCluster?.[0]
      });
    }
  };

  return (
    <>
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
          {errors.original && <p className="text-accent-pop text-sm">{errors.original}</p>}
        </div>

        <div>
          <label htmlFor="education" className="block text-sm font-medium text-gray-700">Niveau opleiding</label>
          <select
            id="education"
            value={formData.education}
            onChange={e => handleChange('education', e.target.value)}
            aria-describedby="education-help"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          >
            <option value="">Kies type</option>
            <option value="MBO">MBO</option>
            <option value="HBO">HBO</option>
            <option value="WO">WO</option>
            <option value="VO">VO</option>
            <option value="VSO">VSO</option>
          </select>
          <small id="education-help" className="text-gray-500">Kies de onderwijssector.</small>
          {errors.education && <p className="text-accent-pop text-sm">{errors.education}</p>}
        </div>

        {formData.education === 'MBO' && (
          <div>
            <label htmlFor="level" className="block text-sm font-medium text-gray-700">Niveau (mbo 2/3/4…)</label>
            <select
              id="level"
              value={formData.level}
              onChange={e => handleChange('level', e.target.value)}
              aria-describedby="level-help"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            >
              <option value="">Kies niveau</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
            <small id="level-help" className="text-gray-500">Bij mbo alleen niveau 2, 3 of 4.</small>
            {errors.level && <p className="text-accent-pop text-sm">{errors.level}</p>}
          </div>
        )}

        {formData.education === 'VSO' && (
          <>
            <div>
              <label htmlFor="level" className="block text-sm font-medium text-gray-700">Niveau (leerroute)</label>
              <select
                id="level"
                value={formData.level}
                onChange={e => handleChange('level', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              >
                <option value="">Kies niveau</option>
                <option value="Arbeidsmarktgerichte route">Arbeidsmarktgerichte route</option>
                <option value="Vervolgonderwijsroute">Vervolgonderwijsroute</option>
                <option value="Dagbestedingsroute">Dagbestedingsroute</option>
              </select>
              {errors.level && <p className="text-accent-pop text-sm">{errors.level}</p>}
            </div>
            <div>
              <label htmlFor="vsoCluster" className="block text-sm font-medium text-gray-700">VSO-cluster</label>
              <select
                id="vsoCluster"
                value={formData.vsoCluster}
                onChange={e => handleChange('vsoCluster', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              >
                <option value="">Kies cluster</option>
                <option value="Cluster 1: blinde en slechtziende kinderen">Cluster 1: blinde en slechtziende kinderen</option>
                <option value="Cluster 2: dove en slechthorende kinderen en kinderen met een taal/spraakprobleem">Cluster 2: dove en slechthorende kinderen en kinderen met een taal/spraakprobleem</option>
                <option value="Cluster 3: motorisch gehandicapte, verstandelijk gehandicapte en langdurig zieke kinderen">Cluster 3: motorisch gehandicapte, verstandelijk gehandicapte en langdurig zieke kinderen</option>
                <option value="Cluster 4: kinderen met psychische stoornissen en gedragsproblemen">Cluster 4: kinderen met psychische stoornissen en gedragsproblemen</option>
              </select>
              {errors.vsoCluster && <p className="text-accent-pop text-sm">{errors.vsoCluster}</p>}
            </div>
          </>
        )}

        {formData.education === 'VO' && (
          <>
            <div>
              <label htmlFor="voLevel" className="block text-sm font-medium text-gray-700">VO-niveau</label>
              <select
                id="voLevel"
                value={formData.voLevel}
                onChange={e => handleChange('voLevel', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              >
                <option value="">Kies VO-niveau</option>
                <option value="vmbo-bb">vmbo-bb</option>
                <option value="vmbo-kb">vmbo-kb</option>
                <option value="vmbo-gl-tl">vmbo-gl-tl</option>
                <option value="havo">havo</option>
                <option value="vwo">vwo</option>
              </select>
              {errors.voLevel && <p className="text-accent-pop text-sm">{errors.voLevel}</p>}
            </div>
            <div>
              <label htmlFor="voGrade" className="block text-sm font-medium text-gray-700">Leerjaar</label>
              <input
                id="voGrade"
                type="number"
                min={1}
                value={formData.voGrade}
                onChange={e => handleChange('voGrade', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                disabled={!formData.voLevel}
              />
              {errors.voGrade && <p className="text-accent-pop text-sm">{errors.voGrade}</p>}
            </div>
          </>
        )}

        <div>
          <label htmlFor="domain" className="block text-sm font-medium text-gray-700">Domein/opleiding</label>
          <input
            id="domain"
            type="text"
            list="domain-options"
            value={formData.domain}
            onChange={e => handleChange('domain', e.target.value)}
            placeholder="Bijv. Marketing"
            aria-describedby="domain-help"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          />
          <datalist id="domain-options">
            <option value="Economie" />
            <option value="Zorg" />
            <option value="Sport & Bewegen" />
            <option value="Techniek" />
          </datalist>
          <small id="domain-help" className="text-gray-500">Noem het domein of de opleiding.</small>
          {errors.domain && <p className="text-accent-pop text-sm">{errors.domain}</p>}
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
          {errors.assessment && <p className="text-accent-pop text-sm">{errors.assessment}</p>}
        </div>

        <button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl font-bold text-lg hover:shadow-lg hover:scale-[1.02] transition-all duration-200">Versturen</button>
      </form>
      <PrivacyNote />
    </>
  );
}
