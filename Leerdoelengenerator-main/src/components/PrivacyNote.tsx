import React from "react";

// Bron: Referentiekader 2.0 (zorgvuldigheid/transparantie)
export default function PrivacyNote() {
  return (
    <p className="mt-4 text-xs text-gray-600 text-center">
      We slaan geen persoonsgegevens op. Resultaten blijven in je browser.{' '}
      <a href="/over" className="text-blue-600 underline">Meer info</a>
    </p>
  );
}

