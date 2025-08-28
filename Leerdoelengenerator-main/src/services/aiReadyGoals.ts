import type {
  AiReadyGoalRequest,
  AiReadyGoalResponse,
} from "@/types/learningGoals";
import { generateAiReadyGoal } from "@/lib/aiReadyGenerator";

export async function createAiReadyGoal(
  req: AiReadyGoalRequest
): Promise<AiReadyGoalResponse> {
  return generateAiReadyGoal(req);
}

