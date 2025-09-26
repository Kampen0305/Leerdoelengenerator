import React, { useEffect, useMemo, useState } from "react";
import { CheckCircle2, ListFilter, X } from "lucide-react";

import {
  assessmentCategories,
  assessmentForms,
  type AssessmentCategory,
} from "@/data/assessmentForms";

interface AssessmentFormsModalProps {
  open: boolean;
  onClose: () => void;
}

type FilterValue = AssessmentCategory | "Alle";

export function AssessmentFormsModal({ open, onClose }: AssessmentFormsModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<FilterValue>("Alle");

  useEffect(() => {
    if (open) {
      setSelectedCategory("Alle");
    }
  }, [open]);

  const categories = useMemo<FilterValue[]>(
    () => ["Alle", ...assessmentCategories],
    []
  );

  const filteredForms = useMemo(
    () =>
      selectedCategory === "Alle"
        ? assessmentForms
        : assessmentForms.filter((form) => form.category === selectedCategory),
    [selectedCategory]
  );

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center px-4 py-8">
      <div
        className="absolute inset-0 bg-black/40"
        aria-hidden="true"
        onClick={onClose}
      />

      <div className="relative z-50 w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-green-50 to-orange-50 px-6 py-4">
          <div>
            <h2 className="flex items-center text-xl font-semibold text-gray-900">
              <ListFilter className="mr-2 h-5 w-5 text-green-600" />
              Toetsvormen overzicht
            </h2>
            <p className="text-sm text-gray-600">
              Kies een hoofdcategorie om passende toetsvormen te bekijken.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 transition hover:bg-white hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label="Sluit overzicht"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-gray-100 px-6 py-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const isActive = category === selectedCategory;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`flex items-center space-x-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? "border-green-500 bg-green-50 text-green-700 shadow-sm"
                      : "border-gray-200 bg-white text-gray-600 hover:border-green-300 hover:text-green-700"
                  }`}
                >
                  <span>{category}</span>
                  {isActive && <CheckCircle2 className="h-4 w-4" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-6 py-6">
          {filteredForms.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-500">
              Geen toetsvormen gevonden voor deze categorie.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredForms.map((form) => (
                <div
                  key={form.name}
                  className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:border-green-300 hover:shadow-md"
                >
                  <p className="text-base font-semibold text-gray-900">{form.name}</p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-500">
                    {form.category}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
