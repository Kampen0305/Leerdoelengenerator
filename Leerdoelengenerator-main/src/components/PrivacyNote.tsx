import React from "react";

export function PrivacyNote() {
  return (
    <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-600">
      We slaan geen persoonsgegevens op. Resultaten blijven in je browser.{" "}
      <a href="/over" className="underline">Meer info</a>
    </div>
  );
}
