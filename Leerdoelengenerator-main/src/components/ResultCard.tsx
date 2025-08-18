import React, { useState } from 'react';
import { Copy, FileText, FileDown } from 'lucide-react';
import { exportToDocx, exportToPdf, ExportMetadata, ExportSection } from '../lib/export';

interface ResultCardProps {
  metadata: ExportMetadata;
  sections: ExportSection[];
}

export function ResultCard({ metadata, sections }: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = [
      metadata.title,
      `Datum: ${metadata.date}`,
      `Baan: ${metadata.baan}`,
      `Sector/Niveau: ${metadata.sector} / ${metadata.niveau}`,
      ...sections.flatMap((s) => [s.title, s.content]),
    ].join('\n\n');

    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDocx = () => exportToDocx(metadata, sections);
  const handlePdf = () => exportToPdf(metadata, sections);

  return (
    <div className="relative bg-white rounded-lg shadow p-6 space-y-4">
      <div className="absolute top-4 right-4 flex space-x-2">
        <button
          onClick={handleCopy}
          className="p-2 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
          title="Kopieer alles"
        >
          <Copy className="w-4 h-4" />
        </button>
        <button
          onClick={handleDocx}
          className="p-2 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
          title="Download .docx"
        >
          <FileText className="w-4 h-4" />
        </button>
        <button
          onClick={handlePdf}
          className="p-2 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
          title="Download .pdf"
        >
          <FileDown className="w-4 h-4" />
        </button>
      </div>

      <h1 className="text-2xl font-bold">{metadata.title}</h1>
      <p className="text-sm text-gray-600">
        {metadata.date} • {metadata.baan} • {metadata.sector}/{metadata.niveau}
      </p>

      {sections.map((section) => (
        <div key={section.title} className="mt-4">
          <h2 className="text-xl font-semibold mb-2">{section.title}</h2>
          <p className="text-gray-700 whitespace-pre-line">{section.content}</p>
        </div>
      ))}

      {copied && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg">
          Gekopieerd!
        </div>
      )}
    </div>
  );
}
