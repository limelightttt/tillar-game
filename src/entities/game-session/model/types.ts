import type {
  CategoryId,
  PictureQuestion,
  QuestionId,
  QuestionOptionId,
  QuestionQueue,
} from "@/entities/question";

export type GameMode = "solo" | "duel-demo";

export type GameStatus = "idle" | "playing" | "feedback" | "round-result" | "finished";

export interface AnswerStats {
  answered: number;
  correct: number;
  errors: number;
  totalResponseTimeMs: number;
  averageResponseTimeMs: number;
  streak: number;
  bestStreak: number;
}

export interface PlayerAnswer {
  questionId: QuestionId;
  optionId: QuestionOptionId;
  correctOptionId: QuestionOptionId;
  isCorrect: boolean;
  responseTimeMs: number;
}

export interface BotAnswer {
  isCorrect: boolean;
  responseTimeMs: number;
}

export interface EducationalFeedback {
  kind: "correct" | "incorrect";
  text: string;
}

export type DuelWinner = "player" | "bot" | "draw";

export type SessionFinishReason = "manual" | "rounds-completed" | "out-of-lives";

export interface DuelResult {
  winner: DuelWinner;
  roundsPlayed: number;
  reason: Exclude<SessionFinishReason, "manual">;
}

/**
 * The plan stays separate from the public bot answer so consumers can reveal the
 * bot only after its simulated response time has elapsed.
 */
export type PendingBotAnswer = BotAnswer;

export interface GameSessionState {
  mode: GameMode;
  selectedCategoryId: CategoryId;
  status: GameStatus;
  currentQuestion: PictureQuestion | null;
  questionQueue: QuestionQueue | null;
  currentRound: number;
  playerLives: number;
  botLives: number;
  playerStats: AnswerStats;
  botStats: AnswerStats;
  playerAnswer: PlayerAnswer | null;
  botAnswer: BotAnswer | null;
  pendingBotAnswer: PendingBotAnswer | null;
  feedback: EducationalFeedback | null;
  duelResult: DuelResult | null;
  finishReason: SessionFinishReason | null;
  elapsedResponseTimeMs: number;
  sessionStartedAtMs: number | null;
  questionStartedAtMs: number | null;
  finishedAtMs: number | null;
}

export interface StartSessionInput {
  mode: GameMode;
  categoryId: CategoryId;
}

export interface GameSessionActions {
  startSession: (input: StartSessionInput, startedAtMs?: number) => boolean;
  answerCurrentQuestion: (optionId: QuestionOptionId, answeredAtMs?: number) => boolean;
  tick: (atMs?: number) => void;
  advance: (startedAtMs?: number) => boolean;
  finishSolo: (finishedAtMs?: number) => boolean;
  resetSession: () => void;
}

export type GameSessionStore = GameSessionState & GameSessionActions;
