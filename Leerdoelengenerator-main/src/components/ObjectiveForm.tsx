import React, { useState } from 'react';

export function ObjectiveForm() {
  const [sector, setSector] = useState('');
  const [level, setLevel] = useState('');
  const [domain, setDomain] = useState('');

  const handleSectorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSector = e.target.value;
    setSector(newSector);
    if (newSector !== 'mbo') {
      setLevel('');
    }
  };

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLevel(e.target.value);
  };

  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDomain(e.target.value);
  };

  return (
    <form className="space-y-4">
      <div>
        <label htmlFor="sector" className="block text-sm font-medium text-gray-700 mb-2">
          Onderwijssector
        </label>
        <select
          id="sector"
          value={sector}
          onChange={handleSectorChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
        >
          <option value="">Kies sector</option>
          <option value="mbo">MBO</option>
          <option value="hbo">HBO</option>
          <option value="wo">WO</option>
        </select>
      </div>

      {sector === 'mbo' && (
        <div>
          <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
            Niveau
          </label>
          <select
            id="level"
            value={level}
            onChange={handleLevelChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          >
            <option value="">Kies niveau</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>
      )}

      <div>
        <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-2">
          Domein / Opleiding
        </label>
        <input
          id="domain"
          list="domain-suggestions"
          type="text"
          value={domain}
          onChange={handleDomainChange}
          placeholder="Bijvoorbeeld: Economie"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
        />
        <datalist id="domain-suggestions">
          <option value="Economie" />
          <option value="Zorg" />
          <option value="Sport & Bewegen" />
          <option value="Techniek" />
        </datalist>
      </div>
    </form>
  );
}
