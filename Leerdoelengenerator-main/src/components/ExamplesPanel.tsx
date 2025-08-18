import React, { useState } from "react";
import { Lightbulb, ChevronDown } from "lucide-react";

interface Example {
  label: string;
  data: {
    original: string;
    context: {
      education: string;
      level: string;
      domain: string;
      assessment: string;
    };
  };
}

interface ExamplesPanelProps {
  onSelect: (data: Example["data"]) => void;
}

export function ExamplesPanel({ onSelect }: ExamplesPanelProps) {
  const [open, setOpen] = useState(false);

  const examples: Example[] = [
    {
      label: "mbo-zorg",
      data: {
        original: "De student kan een zorgplan opstellen voor een patiënt met diabetes.",
        context: {
          education: "MBO",
          level: "Niveau 4",
          domain: "Zorg",
          assessment: "Portfolio",
        },
      },
    },
    {
      label: "mbo-sport",
      data: {
        original: "De student kan een trainingsschema ontwerpen voor een beginnende hardloper.",
        context: {
          education: "MBO",
          level: "Niveau 3",
          domain: "Sport",
          assessment: "Praktijkopdracht",
        },
      },
    },
    {
      label: "hbo-ict",
      data: {
        original: "De student kan een eenvoudige webapplicatie ontwikkelen met React.",
        context: {
          education: "HBO",
          level: "Bachelor",
          domain: "ICT",
          assessment: "Project",
        },
      },
    },
  ];

  return (
    <div className="md:w-64">
      {/* Mobile accordion */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          <span>Voorbeeldcases</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>
        {open && (
          <div className="mt-2 space-y-2">
            {examples.map((ex) => (
              <button
                key={ex.label}
                onClick={() => onSelect(ex.data)}
                className="w-full text-left px-4 py-2 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100"
              >
                {ex.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:block bg-green-50 border border-green-200 rounded-xl p-4">
        <h3 className="font-semibold text-green-800 mb-3 flex items-center">
          <Lightbulb className="w-5 h-5 mr-2" />
          Voorbeeldcases
        </h3>
        <div className="space-y-2">
          {examples.map((ex) => (
            <button
              key={ex.label}
              onClick={() => onSelect(ex.data)}
              className="w-full text-left px-4 py-2 bg-white border border-green-200 rounded-lg hover:bg-green-100"
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

