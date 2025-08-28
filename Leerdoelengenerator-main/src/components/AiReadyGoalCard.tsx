import React from "react";
import type { AiReadyGoalResponse } from "@/types/learningGoals";

export default function AiReadyGoalCard({
  data,
}: {
  data: AiReadyGoalResponse;
}) {
  return (
    <div className="rounded-2xl border p-4 space-y-3">
      <div className="text-sm opacity-70">
        Bloom: {data.bloom} • Toetsbaan: {data.lane.toUpperCase()}
      </div>
      <h3 className="font-semibold">AI-ready leerdoel</h3>
      <p>{data.aiReadyGoal}</p>

      <h4 className="font-semibold mt-2">Uitleg & AI-statement</h4>
      <p>{data.aiStatement}</p>

      <h4 className="font-semibold mt-2">Beoordelingscriteria</h4>
      <ul className="list-disc ml-5">
        {data.rubricCriteria.map((c, i) => (
          <li key={i}>{c}</li>
        ))}
      </ul>

      {data.warnings.length > 0 && (
        <>
          <h4 className="font-semibold mt-2 text-amber-700">
            Niveau-check: verbeteringen nodig
          </h4>
          <ul className="list-disc ml-5 text-amber-700">
            {data.warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </>
      )}

      <div className="text-xs opacity-60">
        trace: {data.trace.verb} • {data.trace.matchedRules.join(", ")}
      </div>
    </div>
  );
}

