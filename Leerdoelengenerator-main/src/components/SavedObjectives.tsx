import React, { useState, useEffect } from 'react';
import { BookOpen, Trash2, Edit3, Calendar, Tag, Search, Filter, X } from 'lucide-react';

interface SavedObjective {
  id: string;
  originalObjective: string;
  aiReadyObjective: string;
  context: {
    education: string;
    level: string;
    domain: string;
    assessment: string;
  };
  createdAt: string;
  tags: string[];
}

interface SavedObjectivesProps {
  onLoadObjective: (objective: SavedObjective) => void;
  onClose: () => void;
}

export function SavedObjectives({ onLoadObjective, onClose }: SavedObjectivesProps) {
  const [savedObjectives, setSavedObjectives] = useState<SavedObjective[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDomain, setFilterDomain] = useState('');
  const [filterEducation, setFilterEducation] = useState('');

  useEffect(() => {
    loadSavedObjectives();
  }, []);

  const loadSavedObjectives = () => {
    const saved = localStorage.getItem('savedObjectives');
    if (saved) {
      setSavedObjectives(JSON.parse(saved));
    }
  };

  const deleteObjective = (id: string) => {
    const updated = savedObjectives.filter(obj => obj.id !== id);
    setSavedObjectives(updated);
    localStorage.setItem('savedObjectives', JSON.stringify(updated));
  };

  const filteredObjectives = savedObjectives.filter(obj => {
    const matchesSearch = obj.originalObjective.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         obj.aiReadyObjective.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDomain = !filterDomain || obj.context.domain.toLowerCase().includes(filterDomain.toLowerCase());
    const matchesEducation = !filterEducation || obj.context.education === filterEducation;
    
    return matchesSearch && matchesDomain && matchesEducation;
  });

  const uniqueDomains = [...new Set(savedObjectives.map(obj => obj.context.domain))];
  const uniqueEducationTypes = [...new Set(savedObjectives.map(obj => obj.context.education))];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-green-600 to-orange-500 bg-clip-text text-transparent">
            Opgeslagen Leerdoelen
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-green-50 to-orange-50">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Zoek in leerdoelen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={filterDomain}
              onChange={(e) => setFilterDomain(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Alle domeinen</option>
              {uniqueDomains.map(domain => (
                <option key={domain} value={domain}>{domain}</option>
              ))}
            </select>

            <select
              value={filterEducation}
              onChange={(e) => setFilterEducation(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Alle onderwijstypes</option>
              {uniqueEducationTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Objectives List */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredObjectives.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Geen opgeslagen leerdoelen gevonden</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredObjectives.map((objective) => (
                <div key={objective.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-2">
                      <Tag className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium bg-gradient-to-r from-green-600 to-orange-500 bg-clip-text text-transparent">
                        {objective.context.education} - {objective.context.level}
                      </span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-600">{objective.context.domain}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        {new Date(objective.createdAt).toLocaleDateString('nl-NL')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-red-700 mb-1">Origineel:</p>
                      <p className="text-sm text-gray-700">{objective.originalObjective}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-green-700 mb-1">AI-ready:</p>
                      <p className="text-sm text-gray-700">{objective.aiReadyObjective}</p>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 mt-4 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => onLoadObjective(objective)}
                      className="flex items-center space-x-1 bg-gradient-to-r from-green-600 to-green-700 text-white px-3 py-1 rounded text-sm hover:from-green-700 hover:to-green-800 transition-colors shadow-md hover:shadow-lg"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Laden</span>
                    </button>
                    <button
                      onClick={() => deleteObjective(objective.id)}
                      className="flex items-center space-x-1 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors shadow-md hover:shadow-lg"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Verwijder</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}