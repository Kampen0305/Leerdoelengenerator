import React, { useState } from "react";

interface Example {
  id: string;
  label: string;
  data: {
    original: string;
    context: {
      education: string;
      level: string;
      domain: string;
      assessment: string;
      voLevel?: string;
      voGrade?: number;
    };
  };
}

interface ExamplesPanelProps {
  onSelectExample: (data: Example["data"]) => void;
}

const examples: Example[] = [
  {
    id: "mbo-zorg",
    label: "mbo-zorg",
    data: {
      original: "De student kan basiszorg verlenen aan een cliënt.",
      context: {
        education: "MBO",
        level: "Niveau 4",
        domain: "Zorg",
        assessment: "Praktijkexamen",
      },
    },
  },
  {
    id: "mbo-sport",
    label: "mbo-sport",
    data: {
      original: "De student kan een trainingsschema opstellen voor een beginnende sporter.",
      context: {
        education: "MBO",
        level: "Niveau 3",
        domain: "Sport & Bewegen",
        assessment: "Portfolio",
      },
    },
  },
  {
    id: "hbo-ict",
    label: "hbo-ict",
    data: {
      original: "De student kan een eenvoudige webapplicatie ontwikkelen en testen.",
      context: {
        education: "HBO",
        level: "Bachelor",
        domain: "ICT",
        assessment: "Projectpresentatie",
      },
    },
  },
];

export default function ExamplesPanel({ onSelectExample }: ExamplesPanelProps) {
  const [open, setOpen] = useState(false);

  const Buttons = () => (
    <div className="mt-4 space-y-2">
      {examples.map((ex) => (
        <button
          key={ex.id}
          onClick={() => onSelectExample(ex.data)}
          className="w-full text-left px-4 py-2 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg text-sm"
        >
          {ex.label}
        </button>
      ))}
    </div>
  );

  return (
    <aside className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
      {/* Mobile accordion */}
      <div className="md:hidden">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex justify-between items-center font-semibold text-gray-800"
        >
          Voorbeeldcases
          <span>{open ? "-" : "+"}</span>
        </button>
        {open && <Buttons />}
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <h3 className="font-semibold text-gray-800">Voorbeeldcases</h3>
        <Buttons />
      </div>
    </aside>
  );
}

