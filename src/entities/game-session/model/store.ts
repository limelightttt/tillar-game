import { create } from "zustand";

import {
  createQuestionQueue,
  filterQuestionsByCategory,
  isCorrectOption,
  type PictureQuestion,
  pictureQuestions,
  type QuestionOptionId,
  type QuestionQueue,
  type RandomSource,
  takeNextQuestion,
} from "@/entities/question";

import type { GameSessionAnalytics, GameSessionAnalyticsEvent } from "./analytics";
import { createPendingBotAnswer } from "./bot";
import { DUEL_ROUND_COUNT, DUEL_STARTING_LIVES } from "./constants";
import {
  addAnswerToStats,
  createEmptyAnswerStats,
  determineDuelWinner,
  determineEliminationWinner,
} from "./scoring";
import { getElapsedResponseTimeMs } from "./timer";
import type {
  BotAnswer,
  DuelResult,
  EducationalFeedback,
  GameSessionState,
  GameSessionStore,
  PendingBotAnswer,
  PlayerAnswer,
  SessionFinishReason,
} from "./types";

export interface GameSessionDependencies {
  questions: readonly PictureQuestion[];
  now: () => number;
  random: RandomSource;
  analytics?: GameSessionAnalytics;
}

const defaultDependencies: GameSessionDependencies = {
  questions: pictureQuestions,
  now: Date.now,
  random: Math.random,
};

const createInitialState = (): GameSessionState => ({
  mode: "solo",
  selectedCategoryId: "all",
  status: "idle",
  currentQuestion: null,
  questionQueue: null,
  currentRound: 0,
  playerLives: DUEL_STARTING_LIVES,
  botLives: DUEL_STARTING_LIVES,
  playerStats: createEmptyAnswerStats(),
  botStats: createEmptyAnswerStats(),
  playerAnswer: null,
  botAnswer: null,
  pendingBotAnswer: null,
  feedback: null,
  duelResult: null,
  finishReason: null,
  elapsedResponseTimeMs: 0,
  sessionStartedAtMs: null,
  questionStartedAtMs: null,
  finishedAtMs: null,
});

const normalizeTimestamp = (value: number | undefined, fallback: () => number) =>
  value !== undefined && Number.isFinite(value) ? value : fallback();

const getFeedback = (
  question: PictureQuestion,
  optionId: QuestionOptionId,
  isCorrect: boolean,
): EducationalFeedback => {
  if (isCorrect) {
    return { kind: "correct", text: question.correctFact };
  }

  const explanation =
    question.incorrectExplanation.optionId === optionId ? question.incorrectExplanation.text : null;

  return {
    kind: "incorrect",
    text: explanation ?? question.correctFact,
  };
};

interface DrawnQuestion {
  question: PictureQuestion;
  queue: QuestionQueue;
}

const drawQuestion = (
  queue: QuestionQueue,
  questions: readonly PictureQuestion[],
  random: RandomSource,
): DrawnQuestion | null => {
  const draw = takeNextQuestion(queue, random);
  const question = questions.find((item) => item.id === draw.questionId);

  return question ? { question, queue: draw.queue } : null;
};

interface ResolvedBot {
  answer: BotAnswer;
  stats: GameSessionState["botStats"];
  lives: number;
}

const resolveBotIfDue = (state: GameSessionState, atMs: number): ResolvedBot | null => {
  if (
    state.mode !== "duel-demo" ||
    state.botAnswer ||
    !state.pendingBotAnswer ||
    state.questionStartedAtMs === null
  ) {
    return null;
  }

  const elapsedMs = getElapsedResponseTimeMs(state.questionStartedAtMs, atMs);

  if (elapsedMs < state.pendingBotAnswer.responseTimeMs) {
    return null;
  }

  return {
    answer: state.pendingBotAnswer,
    stats: addAnswerToStats(
      state.botStats,
      state.pendingBotAnswer.isCorrect,
      state.pendingBotAnswer.responseTimeMs,
    ),
    lives: state.pendingBotAnswer.isCorrect ? state.botLives : Math.max(0, state.botLives - 1),
  };
};

interface DuelSettlement {
  status: GameSessionState["status"];
  result: DuelResult | null;
  finishReason: SessionFinishReason | null;
}

const settleDuel = (
  state: GameSessionState,
  playerAnswer: PlayerAnswer | null,
  botAnswer: BotAnswer | null,
  playerLives: number,
  botLives: number,
  playerStats: GameSessionState["playerStats"],
  botStats: GameSessionState["botStats"],
): DuelSettlement => {
  if (playerLives === 0 || botLives === 0) {
    return {
      status: "finished",
      result: {
        winner: determineEliminationWinner(playerLives, botLives, playerStats, botStats),
        roundsPlayed: state.currentRound,
        reason: "out-of-lives",
      },
      finishReason: "out-of-lives",
    };
  }

  if (!playerAnswer || !botAnswer) {
    return { status: "playing", result: null, finishReason: null };
  }

  const finishReason = state.currentRound >= DUEL_ROUND_COUNT ? "rounds-completed" : null;

  if (!finishReason) {
    return { status: "round-result", result: null, finishReason: null };
  }

  return {
    status: "finished",
    result: {
      winner: determineDuelWinner(playerStats, botStats),
      roundsPlayed: state.currentRound,
      reason: finishReason,
    },
    finishReason,
  };
};

export const createGameSessionStore = (
  dependencyOverrides: Partial<GameSessionDependencies> = {},
) => {
  const dependencies: GameSessionDependencies = {
    ...defaultDependencies,
    ...dependencyOverrides,
  };
  const emit = (event: GameSessionAnalyticsEvent) => {
    dependencies.analytics?.(event);
  };

  return create<GameSessionStore>()((set, get) => ({
    ...createInitialState(),

    startSession: (input, startedAtMs) => {
      const timestampMs = normalizeTimestamp(startedAtMs, dependencies.now);
      const questions = filterQuestionsByCategory(dependencies.questions, input.categoryId);

      if (questions.length === 0) {
        return false;
      }

      const queue = createQuestionQueue(
        questions.map((question) => question.id),
        { random: dependencies.random },
      );
      const draw = drawQuestion(queue, questions, dependencies.random);

      if (!draw) {
        return false;
      }

      const pendingBotAnswer =
        input.mode === "duel-demo" ? createPendingBotAnswer(dependencies.random) : null;

      set({
        ...createInitialState(),
        mode: input.mode,
        selectedCategoryId: input.categoryId,
        status: "playing",
        currentQuestion: draw.question,
        questionQueue: draw.queue,
        currentRound: 1,
        pendingBotAnswer,
        sessionStartedAtMs: timestampMs,
        questionStartedAtMs: timestampMs,
      });

      emit({
        type: "session-started",
        mode: input.mode,
        categoryId: input.categoryId,
        timestampMs,
      });
      emit({
        type: "question-presented",
        mode: input.mode,
        questionId: draw.question.id,
        round: 1,
        cycle: draw.queue.cycle,
        timestampMs,
      });
      return true;
    },

    answerCurrentQuestion: (optionId, answeredAtMs) => {
      const state = get();

      if (
        state.status !== "playing" ||
        !state.currentQuestion ||
        state.questionStartedAtMs === null ||
        state.playerAnswer ||
        !state.currentQuestion.options.some((option) => option.id === optionId)
      ) {
        return false;
      }

      const timestampMs = normalizeTimestamp(answeredAtMs, dependencies.now);
      const responseTimeMs = getElapsedResponseTimeMs(state.questionStartedAtMs, timestampMs);
      const isCorrect = isCorrectOption(state.currentQuestion, optionId);
      const playerAnswer: PlayerAnswer = {
        questionId: state.currentQuestion.id,
        optionId,
        correctOptionId: state.currentQuestion.correctOptionId,
        isCorrect,
        responseTimeMs,
      };
      const playerStats = addAnswerToStats(state.playerStats, isCorrect, responseTimeMs);
      const playerLives =
        state.mode === "duel-demo" && !isCorrect
          ? Math.max(0, state.playerLives - 1)
          : state.playerLives;
      const resolvedBot = resolveBotIfDue(state, timestampMs);
      const botAnswer = resolvedBot?.answer ?? state.botAnswer;
      const botStats = resolvedBot?.stats ?? state.botStats;
      const botLives = resolvedBot?.lives ?? state.botLives;
      const duelSettlement =
        state.mode === "duel-demo"
          ? settleDuel(state, playerAnswer, botAnswer, playerLives, botLives, playerStats, botStats)
          : null;
      const status = state.mode === "solo" ? "feedback" : (duelSettlement?.status ?? "playing");

      set({
        playerAnswer,
        playerStats,
        playerLives,
        botLives,
        botAnswer,
        botStats,
        pendingBotAnswer: status === "finished" || resolvedBot ? null : state.pendingBotAnswer,
        feedback:
          state.mode === "solo" ? getFeedback(state.currentQuestion, optionId, isCorrect) : null,
        elapsedResponseTimeMs: responseTimeMs,
        status,
        duelResult: duelSettlement?.result ?? null,
        finishReason: duelSettlement?.finishReason ?? null,
        finishedAtMs: status === "finished" ? timestampMs : null,
      });

      if (resolvedBot) {
        emit({
          type: "answer-recorded",
          actor: "bot",
          questionId: state.currentQuestion.id,
          round: state.currentRound,
          isCorrect: resolvedBot.answer.isCorrect,
          responseTimeMs: resolvedBot.answer.responseTimeMs,
          timestampMs: state.questionStartedAtMs + resolvedBot.answer.responseTimeMs,
        });
      }
      emit({
        type: "answer-recorded",
        actor: "player",
        questionId: state.currentQuestion.id,
        round: state.currentRound,
        isCorrect,
        responseTimeMs,
        timestampMs,
      });

      if (state.mode === "duel-demo" && botAnswer) {
        emit({
          type: "round-completed",
          questionId: state.currentQuestion.id,
          round: state.currentRound,
          timestampMs,
        });
      }

      if (duelSettlement?.result && duelSettlement.finishReason) {
        emit({
          type: "session-finished",
          mode: state.mode,
          reason: duelSettlement.finishReason,
          roundsPlayed: state.currentRound,
          winner: duelSettlement.result.winner,
          timestampMs,
        });
      }

      return true;
    },

    tick: (atMs) => {
      const state = get();

      if (
        state.status !== "playing" ||
        !state.currentQuestion ||
        state.questionStartedAtMs === null
      ) {
        return;
      }

      const timestampMs = normalizeTimestamp(atMs, dependencies.now);
      const elapsedResponseTimeMs = state.playerAnswer
        ? state.elapsedResponseTimeMs
        : getElapsedResponseTimeMs(state.questionStartedAtMs, timestampMs);
      const resolvedBot = resolveBotIfDue(state, timestampMs);

      if (!resolvedBot) {
        if (elapsedResponseTimeMs !== state.elapsedResponseTimeMs) {
          set({ elapsedResponseTimeMs });
        }
        return;
      }

      const duelSettlement = settleDuel(
        state,
        state.playerAnswer,
        resolvedBot.answer,
        state.playerLives,
        resolvedBot.lives,
        state.playerStats,
        resolvedBot.stats,
      );

      set({
        elapsedResponseTimeMs,
        botAnswer: resolvedBot.answer,
        botStats: resolvedBot.stats,
        botLives: resolvedBot.lives,
        pendingBotAnswer: null,
        status: duelSettlement.status,
        duelResult: duelSettlement.result,
        finishReason: duelSettlement.finishReason,
        finishedAtMs: duelSettlement.status === "finished" ? timestampMs : null,
      });

      emit({
        type: "answer-recorded",
        actor: "bot",
        questionId: state.currentQuestion.id,
        round: state.currentRound,
        isCorrect: resolvedBot.answer.isCorrect,
        responseTimeMs: resolvedBot.answer.responseTimeMs,
        timestampMs: state.questionStartedAtMs + resolvedBot.answer.responseTimeMs,
      });

      if (state.playerAnswer) {
        emit({
          type: "round-completed",
          questionId: state.currentQuestion.id,
          round: state.currentRound,
          timestampMs,
        });
      }

      if (duelSettlement.result && duelSettlement.finishReason) {
        emit({
          type: "session-finished",
          mode: state.mode,
          reason: duelSettlement.finishReason,
          roundsPlayed: state.currentRound,
          winner: duelSettlement.result.winner,
          timestampMs,
        });
      }
    },

    advance: (startedAtMs) => {
      const state = get();
      const canAdvance =
        (state.mode === "solo" && state.status === "feedback") ||
        (state.mode === "duel-demo" && state.status === "round-result");

      if (!canAdvance || !state.questionQueue) {
        return false;
      }

      const timestampMs = normalizeTimestamp(startedAtMs, dependencies.now);
      const draw = drawQuestion(state.questionQueue, dependencies.questions, dependencies.random);

      if (!draw) {
        return false;
      }

      const currentRound = state.currentRound + 1;
      const pendingBotAnswer: PendingBotAnswer | null =
        state.mode === "duel-demo" ? createPendingBotAnswer(dependencies.random) : null;

      set({
        status: "playing",
        currentQuestion: draw.question,
        questionQueue: draw.queue,
        currentRound,
        playerAnswer: null,
        botAnswer: null,
        pendingBotAnswer,
        feedback: null,
        duelResult: null,
        finishReason: null,
        elapsedResponseTimeMs: 0,
        questionStartedAtMs: timestampMs,
        finishedAtMs: null,
      });

      emit({
        type: "question-presented",
        mode: state.mode,
        questionId: draw.question.id,
        round: currentRound,
        cycle: draw.queue.cycle,
        timestampMs,
      });
      return true;
    },

    finishSolo: (finishedAtMs) => {
      const state = get();

      if (state.mode !== "solo" || state.status === "idle" || state.status === "finished") {
        return false;
      }

      const timestampMs = normalizeTimestamp(finishedAtMs, dependencies.now);
      set({
        status: "finished",
        finishReason: "manual",
        finishedAtMs: timestampMs,
        feedback: null,
      });
      emit({
        type: "session-finished",
        mode: state.mode,
        reason: "manual",
        roundsPlayed: state.playerStats.answered,
        winner: null,
        timestampMs,
      });
      return true;
    },

    resetSession: () => set(createInitialState()),
  }));
};

/** In-memory singleton for React consumers; no persistence middleware is used. */
export const useGameSessionStore = createGameSessionStore();
