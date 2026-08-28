import type { CategoryId } from "@/entities/question";
import type {
  LetterTile,
  LetterTileId,
  WordPuzzle,
  WordPuzzleId,
  WordPuzzleQueue,
} from "@/entities/word-puzzle";

export type WordGameMode = "solo" | "duel-demo";

export type WordGameStatus = "idle" | "playing" | "feedback" | "round-result" | "finished";

export interface WordAnswerStats {
  answered: number;
  correct: number;
  errors: number;
  totalResponseTimeMs: number;
  averageResponseTimeMs: number;
  streak: number;
  bestStreak: number;
}

export interface WordPlayerAnswer {
  puzzleId: WordPuzzleId;
  selectedTileIds: readonly LetterTileId[];
  submittedWord: string;
  correctWord: string;
  isCorrect: boolean;
  responseTimeMs: number;
}

export interface WordBotAnswer {
  isCorrect: boolean;
  responseTimeMs: number;
}

export interface WordEducationalFeedback {
  kind: "correct" | "incorrect";
  submittedWord: string;
  correctWord: string;
  explanation: string;
}

export type WordDuelWinner = "player" | "bot" | "draw";

export type WordSessionFinishReason = "manual" | "rounds-completed" | "out-of-lives";

export interface WordDuelResult {
  winner: WordDuelWinner;
  roundsPlayed: number;
  reason: Exclude<WordSessionFinishReason, "manual">;
}

export interface WordGameSessionState {
  mode: WordGameMode;
  selectedCategoryId: CategoryId;
  status: WordGameStatus;
  currentPuzzle: WordPuzzle | null;
  puzzleQueue: WordPuzzleQueue | null;
  letterTiles: readonly LetterTile[];
  selectedTileIds: readonly LetterTileId[];
  currentRound: number;
  playerLives: number;
  botLives: number;
  playerStats: WordAnswerStats;
  botStats: WordAnswerStats;
  playerAnswer: WordPlayerAnswer | null;
  botAnswer: WordBotAnswer | null;
  pendingBotAnswer: WordBotAnswer | null;
  feedback: WordEducationalFeedback | null;
  duelResult: WordDuelResult | null;
  finishReason: WordSessionFinishReason | null;
  elapsedResponseTimeMs: number;
  sessionStartedAtMs: number | null;
  puzzleStartedAtMs: number | null;
  finishedAtMs: number | null;
}

export interface StartWordGameSessionInput {
  mode: WordGameMode;
  categoryId: CategoryId;
}

export interface WordGameSessionActions {
  startSession: (input: StartWordGameSessionInput, startedAtMs?: number) => boolean;
  selectTile: (tileId: LetterTileId) => boolean;
  removeTile: (tileId: LetterTileId) => boolean;
  clearSelection: () => void;
  submitAnswer: (answeredAtMs?: number) => boolean;
  tick: (atMs?: number) => void;
  advance: (startedAtMs?: number) => boolean;
  finishSolo: (finishedAtMs?: number) => boolean;
  resetSession: () => void;
}

export type WordGameSessionStore = WordGameSessionState & WordGameSessionActions;
