import React from "react";
import InfoBox from "./components/InfoBox";

type Lane = "baan1" | "baan2";

interface ObjectiveFormProps {
  lane: "" | Lane;
  onLaneChange: (lane: Lane) => void;
  geminiAvailable: boolean;
}

export function ObjectiveForm({ lane, onLaneChange, geminiAvailable }: ObjectiveFormProps) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
      <div className="text-sm font-medium text-slate-700 mb-2">Kies aanpak *</div>
      <div className="flex flex-wrap gap-4">
        <label className="inline-flex items-center gap-2">
          <input
            type="radio"
            name="lane"
            value="baan1"
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
            checked={lane === "baan2"}
            onChange={() => onLaneChange("baan2")}
            disabled={!geminiAvailable}
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
    </div>
  );
}

export default ObjectiveForm;
