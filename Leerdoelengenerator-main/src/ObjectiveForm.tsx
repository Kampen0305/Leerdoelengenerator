import React from "react";
import InfoBox from "./components/InfoBox";
import { Sector, Baan } from "@/core/education/ui-adapters";
import { isFunderend } from "@/features/sector/utils";

interface ObjectiveFormProps {
  sector: Sector;
  baan: Baan;
  onBaanChange: (baan: Baan) => void;
  geminiAvailable: boolean;
}

export function ObjectiveForm({ sector, baan, onBaanChange, geminiAvailable }: ObjectiveFormProps) {
  const baanDisabled = isFunderend(sector);
  return (
    <fieldset className="bg-slate-50 border border-slate-200 rounded-lg p-4" aria-disabled={baanDisabled}>
      <legend className="text-sm font-medium text-slate-700 mb-2">Kies aanpak *</legend>
      <div className="flex flex-wrap gap-4">
        <label className="inline-flex items-center gap-2">
          <input
            type="radio"
            name="baan"
            value="1"
            onChange={() => onBaanChange(1)}
            checked={baan === 1}
            disabled={baanDisabled}
          />
          <span>
            Baan 1 (besluitvormend, beperkt AI)
            <InfoBox>
              <p>Klassieke besluitvorming en begeleiding.</p>
              <p>AI wordt slechts beperkt gebruikt.</p>
              <p>Nadruk op menselijke afwegingen.</p>
            </InfoBox>
          </span>
        </label>
        <label className="inline-flex items-center gap-2">
          <input
            type="radio"
            name="baan"
            value="2"
            onChange={() => onBaanChange(2)}
            checked={baan === 2}
            disabled={baanDisabled || !geminiAvailable}
          />
          <span>
            Baan 2 (ontwikkelingsgericht, AI toegestaan/verplicht)
            <InfoBox>
              <p>Gericht op leren en experimenteren.</p>
              <p>AI-gebruik is toegestaan of verplicht.</p>
              <p>Stimuleert innovatie en digitale vaardigheden.</p>
            </InfoBox>
          </span>
        </label>
      </div>
      {baanDisabled && (
        <p className="hint">
          Baan-keuze is alleen van toepassing op het <strong>beroepsonderwijs</strong> (MBO/HBO/WO).
        </p>
      )}
    </fieldset>
  );
}

export default ObjectiveForm;
