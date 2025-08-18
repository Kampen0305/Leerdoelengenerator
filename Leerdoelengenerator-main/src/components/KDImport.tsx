import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';
import { KDStructure, KDParseResult } from '../types/kd';
import { KDParser } from '../utils/kdParser';

interface KDImportProps {
  onKDImported: (kd: KDStructure) => void;
  onClose: () => void;
}

export function KDImport({ onKDImported, onClose }: KDImportProps) {
  const [dragActive, setDragActive] = useState(false);
  const [parseResult, setParseResult] = useState<KDParseResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    setIsProcessing(true);
    setParseResult(null);

    try {
      const content = await file.text();
      const result = KDParser.parseFromText(content);
      setParseResult(result);
      
      if (result.success && result.data) {
        // Auto-import after 2 seconds if successful
        setTimeout(() => {
          onKDImported(result.data!);
          onClose();
        }, 2000);
      }
    } catch (error) {
      setParseResult({
        success: false,
        error: 'Kon bestand niet lezen'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualImport = () => {
    if (parseResult?.success && parseResult.data) {
      onKDImported(parseResult.data);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-green-600 to-orange-500 bg-clip-text text-transparent">
            KD Importeren
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
              dragActive 
                ? 'border-green-400 bg-green-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Sleep uw KD-bestand hierheen
            </h3>
            <p className="text-gray-600 mb-4">
              Of klik om een bestand te selecteren
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-gradient-to-r from-green-600 to-orange-500 text-white py-2 px-4 rounded-lg font-medium hover:from-green-700 hover:to-orange-600 transition-colors shadow-md hover:shadow-lg"
            >
              Bestand selecteren
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,.txt,.doc,.docx"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>

          {/* Processing State */}
          {isProcessing && (
            <div className="text-center py-8">
              <div className="relative w-8 h-8 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-green-200"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-green-600 animate-spin"></div>
              </div>
              <p className="text-gray-600">KD wordt verwerkt...</p>
            </div>
          )}

          {/* Parse Results */}
          {parseResult && !isProcessing && (
            <div className="space-y-4">
              {parseResult.success ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <h4 className="font-medium text-green-800">KD succesvol verwerkt</h4>
                  </div>
                  
                  {parseResult.data && (
                    <div className="space-y-3 text-sm">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="font-medium text-green-700">Titel:</span>
                          <p className="text-green-600">{parseResult.data.metadata.title}</p>
                        </div>
                        <div>
                          <span className="font-medium text-green-700">Code:</span>
                          <p className="text-green-600">{parseResult.data.metadata.code}</p>
                        </div>
                        <div>
                          <span className="font-medium text-green-700">Niveau:</span>
                          <p className="text-green-600">{parseResult.data.metadata.level}</p>
                        </div>
                        <div>
                          <span className="font-medium text-green-700">Sector:</span>
                          <p className="text-green-600">{parseResult.data.metadata.sector}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 pt-3 border-t border-green-200">
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-700">
                            {parseResult.data.competencies.length}
                          </div>
                          <div className="text-green-600">Competenties</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-700">
                            {parseResult.data.workProcesses.length}
                          </div>
                          <div className="text-green-600">Werkprocessen</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-700">
                            {parseResult.data.learningOutcomes.length}
                          </div>
                          <div className="text-green-600">Leeruitkomsten</div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={handleManualImport}
                      className="bg-gradient-to-r from-green-600 to-green-700 text-white py-2 px-4 rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-colors shadow-md hover:shadow-lg"
                    >
                      KD gebruiken
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                    <h4 className="font-medium text-red-800">Fout bij verwerken</h4>
                  </div>
                  <p className="text-red-700 mb-3">{parseResult.error}</p>
                  
                  {parseResult.suggestions && (
                    <div>
                      <p className="font-medium text-red-800 mb-2">Suggesties:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                        {parseResult.suggestions.map((suggestion, idx) => (
                          <li key={idx}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Format Information */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h4 className="font-medium text-orange-800 mb-2 flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Ondersteunde formaten
            </h4>
            <div className="text-sm text-orange-700 space-y-2">
              <p><strong>JSON:</strong> Gestructureerd KD-bestand met metadata, competenties, werkprocessen en leeruitkomsten</p>
              <p><strong>Tekst:</strong> Gestructureerd tekstbestand met duidelijke secties en labels</p>
              <p><strong>Word:</strong> Document met gestructureerde inhoud (wordt als tekst verwerkt)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}