import type { CategoryId, QuestionId } from "@/entities/question";

import type { DuelWinner, GameMode, SessionFinishReason } from "./types";

export type GameSessionAnalyticsEvent =
  | {
      type: "session-started";
      mode: GameMode;
      categoryId: CategoryId;
      timestampMs: number;
    }
  | {
      type: "question-presented";
      mode: GameMode;
      questionId: QuestionId;
      round: number;
      cycle: number;
      timestampMs: number;
    }
  | {
      type: "answer-recorded";
      actor: "player" | "bot";
      questionId: QuestionId;
      round: number;
      isCorrect: boolean;
      responseTimeMs: number;
      timestampMs: number;
    }
  | {
      type: "round-completed";
      questionId: QuestionId;
      round: number;
      timestampMs: number;
    }
  | {
      type: "session-finished";
      mode: GameMode;
      reason: SessionFinishReason;
      roundsPlayed: number;
      winner: DuelWinner | null;
      timestampMs: number;
    };

export type GameSessionAnalytics = (event: GameSessionAnalyticsEvent) => void;
