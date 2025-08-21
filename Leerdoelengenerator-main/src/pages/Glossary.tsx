import React from "react";
import { Sparkles, Package, BookOpen, BarChart3, GraduationCap } from "lucide-react";

export default function Glossary() {
  const items = [
    {
      term: "AI-ready leerdoelen",
      icon: <Sparkles className="w-5 h-5 text-green-600 mr-2" />,
      description:
        "Leerdoelen die expliciet beschrijven hoe AI wordt ingezet en welke vaardigheden of inzichten daarbij horen.",
    },
    {
      term: "Product- en procesvormen",
      icon: <Package className="w-5 h-5 text-green-600 mr-2" />,
      description:
        "Manieren waarop studenten hun werk opleveren (product) en hoe het tot stand komt (proces), vaak beide beoordelingsaspecten.",
    },
    {
      term: "Handreikingen",
      icon: <BookOpen className="w-5 h-5 text-green-600 mr-2" />,
      description:
        "Praktische richtlijnen en tips die docenten helpen bij het vormgeven van AI-onderwijs.",
    },
    {
      term: "Bloom-niveaus",
      icon: <BarChart3 className="w-5 h-5 text-green-600 mr-2" />,
      description:
        "Cognitieve niveaus uit de taxonomie van Bloom, van onthouden en begrijpen tot creëren en evalueren.",
    },
    {
      term: "Uitstroomprofielen VSO",
      icon: <GraduationCap className="w-5 h-5 text-green-600 mr-2" />,
      description:
        "Profielen binnen het voortgezet speciaal onderwijs die richting geven aan leren en werken na de schooltijd.",
    },
  ];

  return (
    <main className="max-w-screen-xl mx-auto px-4 lg:px-8 py-8 space-y-6">
      <h1 className="text-3xl md:text-4xl font-bold">Begrippenlijst</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <dl className="space-y-6">
          {items.map(({ term, icon, description }) => (
            <div key={term}>
              <dt className="flex items-center text-lg font-semibold bg-gradient-to-r from-green-600 to-orange-500 bg-clip-text text-transparent">
                {icon}
                <span>{term}</span>
              </dt>
              <dd className="ml-7 text-gray-700">{description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </main>
  );
}

