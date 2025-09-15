import React, { useState } from 'react';
import { Copy, Search, X, Star, Award } from 'lucide-react';
import { templates } from '@/data/templates';
import type { TemplateItem, OnderwijsType } from '@/types';

interface TemplateLibraryProps {
  onUseTemplate: (template: TemplateItem) => void;
  onClose: () => void;
}

export function TemplateLibrary({ onUseTemplate, onClose }: TemplateLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | OnderwijsType>('ALL');

  const filteredTemplates = templates.filter((t) =>
    (typeFilter === 'ALL' || t.onderwijsType === typeFilter) &&
    t.titel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedTemplates = filteredTemplates.sort(
    (a, b) => (b.kwaliteit ?? 0) - (a.kwaliteit ?? 0)
  );

  const getQualityColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 75) return 'text-orange-600';
    return 'text-red-600';
  };

  const getQualityBackground = (score: number) => {
    if (score >= 85) return 'bg-green-100';
    if (score >= 75) return 'bg-orange-100';
    return 'bg-red-100';
  };

  const laneLabel = (baan: 1 | 2) =>
    baan === 1 ? 'Baan 1 (AI-bewust)' : 'Baan 2 (AI-geletterd)';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-green-600 to-orange-500 bg-clip-text text-transparent flex items-center">
            <Award className="w-5 h-5 text-green-600 mr-2" />
            Eenvoudige AI-Ready Templates
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-green-50 to-orange-50">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Zoek eenvoudige templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as 'ALL' | OnderwijsType)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="ALL">Alle onderwijstypes</option>
              <option value="FUNDEREND">Funderend</option>
              <option value="BEROEPS">Beroepsonderwijs</option>
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {sortedTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {template.titel}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                      <span className="bg-gradient-to-r from-green-100 to-orange-100 text-green-800 px-2 py-1 rounded border border-green-200">
                        {template.sector}
                      </span>
                      {template.niveau && (
                        <>
                          <span>•</span>
                          <span>{template.niveau}</span>
                        </>
                      )}
                      <span>•</span>
                      <span>{template.leergebied}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    {template.kwaliteit !== undefined && (
                      <div
                        className={`px-2 py-1 rounded text-xs font-medium ${getQualityBackground(
                          template.kwaliteit
                        )}`}
                      >
                        <span className={getQualityColor(template.kwaliteit)}>
                          <Star className="w-4 h-4 text-orange-500 inline mr-1" />
                          Kwaliteit: {template.kwaliteit}%
                        </span>
                      </div>
                    )}
                    <div className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {laneLabel(template.baan)}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div>
                    <p className="text-sm font-medium text-red-700 mb-1">Origineel leerdoel:</p>
                    <p className="text-sm text-gray-700">
                      {template.origineelLeerdoel}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-green-700 mb-1">AI-ready (Eenvoudiger):</p>
                    <p className="text-sm text-gray-700">
                      {template.aiReadyLeerdoel}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => onUseTemplate(template)}
                    className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-orange-500 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-orange-600 transition-colors shadow-md hover:shadow-lg"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Gebruik Template</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600 text-center">
            Templates met eenvoudige taal • Geschikt voor alle onderwijsniveaus
          </p>
        </div>
      </div>
    </div>
  );
}

