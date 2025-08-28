import type { BloomLevel, Lane } from "@/types/learningGoals";

export function laneFor(level: BloomLevel): Lane {
  switch (level) {
    case "remember":
    case "understand":
      return "baan1"; // zelfstandig aantonen, AI uitsluiten of zeer beperkt
    case "apply":
    case "analyze":
    case "evaluate":
    case "create":
      return "baan2"; // leren & toetsen mét AI, met verantwoording
  }
}

