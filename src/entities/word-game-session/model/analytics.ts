import type { CategoryId } from "@/entities/question";
import type { WordPuzzleId } from "@/entities/word-puzzle";

import type { WordDuelWinner, WordGameMode, WordSessionFinishReason } from "./types";

export type WordGameSessionAnalyticsEvent =
  | {
      type: "session-started";
      mode: WordGameMode;
      categoryId: CategoryId;
      timestampMs: number;
    }
  | {
      type: "puzzle-presented";
      mode: WordGameMode;
      puzzleId: WordPuzzleId;
      round: number;
      cycle: number;
      timestampMs: number;
    }
  | {
      type: "answer-recorded";
      actor: "player" | "bot";
      puzzleId: WordPuzzleId;
      round: number;
      isCorrect: boolean;
      responseTimeMs: number;
      timestampMs: number;
    }
  | {
      type: "round-completed";
      puzzleId: WordPuzzleId;
      round: number;
      timestampMs: number;
    }
  | {
      type: "session-finished";
      mode: WordGameMode;
      reason: WordSessionFinishReason;
      roundsPlayed: number;
      winner: WordDuelWinner | null;
      timestampMs: number;
    };

export type WordGameSessionAnalytics = (event: WordGameSessionAnalyticsEvent) => void;
