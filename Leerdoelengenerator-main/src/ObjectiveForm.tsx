import React from "react";
import InfoBox from "./components/InfoBox";
import { Sector, isBaanApplicable } from "@/core/education/ui-adapters";

type Lane = "baan1" | "baan2";

interface ObjectiveFormProps {
  sector: Sector;
  lane: "" | Lane;
  onLaneChange: (lane: Lane) => void;
  geminiAvailable: boolean;
}

export function ObjectiveForm({ sector, lane, onLaneChange, geminiAvailable }: ObjectiveFormProps) {
  const baanEnabled = isBaanApplicable(sector);
  return (
    <fieldset className="bg-slate-50 border border-slate-200 rounded-lg p-4" aria-disabled={!baanEnabled}>
      <legend className="text-sm font-medium text-slate-700 mb-2">Kies aanpak *</legend>
      <div className="flex flex-wrap gap-4">
        <label className="inline-flex items-center gap-2">
          <input
            type="radio"
            name="lane"
            value="baan1"
            disabled={!baanEnabled}
            checked={lane === "baan1"}
            onChange={() => onLaneChange("baan1")}
            required
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
            name="lane"
            value="baan2"
            disabled={!baanEnabled || !geminiAvailable}
            checked={lane === "baan2"}
            onChange={() => onLaneChange("baan2")}
            required
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
      {!baanEnabled && (
        <p className="hint mt-2 text-sm text-gray-600">
          Baan-keuze is alleen van toepassing op het <strong>beroepsonderwijs</strong> (MBO/HBO/WO).
        </p>
      )}
    </fieldset>
  );
}

export default ObjectiveForm;
