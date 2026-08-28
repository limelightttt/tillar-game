import { create } from "zustand";

import type { CategoryId } from "@/entities/question";
import {
  addLetterTile,
  buildWordFromTiles,
  createLetterTiles,
  createWordPuzzleQueue,
  filterWordPuzzlesByCategory,
  getWordLength,
  isCorrectWord,
  type RandomSource,
  removeLetterTile,
  takeNextWordPuzzle,
  type WordPuzzle,
  type WordPuzzleQueue,
  wordPuzzles,
} from "@/entities/word-puzzle";

import type { WordGameSessionAnalytics, WordGameSessionAnalyticsEvent } from "./analytics";
import { createPendingWordBotAnswer } from "./bot";
import { WORD_DUEL_ROUND_COUNT, WORD_DUEL_STARTING_LIVES } from "./constants";
import {
  addWordAnswerToStats,
  createEmptyWordAnswerStats,
  determineWordDuelWinner,
  determineWordEliminationWinner,
} from "./scoring";
import { getWordResponseTimeMs } from "./timer";
import type {
  WordBotAnswer,
  WordDuelResult,
  WordEducationalFeedback,
  WordGameSessionState,
  WordGameSessionStore,
  WordPlayerAnswer,
  WordSessionFinishReason,
} from "./types";

export interface WordGameSessionDependencies {
  puzzles: readonly WordPuzzle[];
  now: () => number;
  random: RandomSource;
  analytics?: WordGameSessionAnalytics;
}

const defaultDependencies: WordGameSessionDependencies = {
  puzzles: wordPuzzles,
  now: Date.now,
  random: Math.random,
};

const createInitialState = (): WordGameSessionState => ({
  mode: "solo",
  selectedCategoryId: "all",
  status: "idle",
  currentPuzzle: null,
  puzzleQueue: null,
  letterTiles: [],
  selectedTileIds: [],
  currentRound: 0,
  playerLives: WORD_DUEL_STARTING_LIVES,
  botLives: WORD_DUEL_STARTING_LIVES,
  playerStats: createEmptyWordAnswerStats(),
  botStats: createEmptyWordAnswerStats(),
  playerAnswer: null,
  botAnswer: null,
  pendingBotAnswer: null,
  feedback: null,
  duelResult: null,
  finishReason: null,
  elapsedResponseTimeMs: 0,
  sessionStartedAtMs: null,
  puzzleStartedAtMs: null,
  finishedAtMs: null,
});

const normalizeTimestamp = (value: number | undefined, fallback: () => number) =>
  value !== undefined && Number.isFinite(value) ? value : fallback();

interface DrawnPuzzle {
  puzzle: WordPuzzle;
  queue: WordPuzzleQueue;
}

const drawPuzzle = (
  queue: WordPuzzleQueue,
  puzzles: readonly WordPuzzle[],
  random: RandomSource,
): DrawnPuzzle | null => {
  const draw = takeNextWordPuzzle(queue, random);
  const puzzle = puzzles.find((item) => item.id === draw.puzzleId);

  return puzzle ? { puzzle, queue: draw.queue } : null;
};

interface ResolvedBot {
  answer: WordBotAnswer;
  stats: WordGameSessionState["botStats"];
  lives: number;
}

const resolveBotIfDue = (state: WordGameSessionState, atMs: number): ResolvedBot | null => {
  if (
    state.mode !== "duel-demo" ||
    state.botAnswer ||
    !state.pendingBotAnswer ||
    state.puzzleStartedAtMs === null
  ) {
    return null;
  }

  const elapsedMs = getWordResponseTimeMs(state.puzzleStartedAtMs, atMs);

  if (elapsedMs < state.pendingBotAnswer.responseTimeMs) {
    return null;
  }

  return {
    answer: state.pendingBotAnswer,
    stats: addWordAnswerToStats(
      state.botStats,
      state.pendingBotAnswer.isCorrect,
      state.pendingBotAnswer.responseTimeMs,
    ),
    lives: state.pendingBotAnswer.isCorrect ? state.botLives : Math.max(0, state.botLives - 1),
  };
};

interface DuelSettlement {
  status: WordGameSessionState["status"];
  result: WordDuelResult | null;
  finishReason: WordSessionFinishReason | null;
}

const settleDuel = (
  state: WordGameSessionState,
  playerAnswer: WordPlayerAnswer | null,
  botAnswer: WordBotAnswer | null,
  playerLives: number,
  botLives: number,
  playerStats: WordGameSessionState["playerStats"],
  botStats: WordGameSessionState["botStats"],
): DuelSettlement => {
  if (playerLives === 0 || botLives === 0) {
    return {
      status: "finished",
      result: {
        winner: determineWordEliminationWinner(playerLives, botLives, playerStats, botStats),
        roundsPlayed: state.currentRound,
        reason: "out-of-lives",
      },
      finishReason: "out-of-lives",
    };
  }

  if (!playerAnswer || !botAnswer) {
    return { status: "playing", result: null, finishReason: null };
  }

  if (state.currentRound < WORD_DUEL_ROUND_COUNT) {
    return { status: "round-result", result: null, finishReason: null };
  }

  return {
    status: "finished",
    result: {
      winner: determineWordDuelWinner(playerStats, botStats),
      roundsPlayed: state.currentRound,
      reason: "rounds-completed",
    },
    finishReason: "rounds-completed",
  };
};

const createFeedback = (
  state: WordGameSessionState,
  submittedWord: string,
  isCorrect: boolean,
): WordEducationalFeedback | null =>
  state.currentPuzzle
    ? {
        kind: isCorrect ? "correct" : "incorrect",
        submittedWord,
        correctWord: state.currentPuzzle.answer,
        explanation: state.currentPuzzle.explanation,
      }
    : null;

export const createWordGameSessionStore = (
  dependencyOverrides: Partial<WordGameSessionDependencies> = {},
) => {
  const dependencies: WordGameSessionDependencies = {
    ...defaultDependencies,
    ...dependencyOverrides,
  };
  const emit = (event: WordGameSessionAnalyticsEvent) => {
    dependencies.analytics?.(event);
  };

  const getCategoryPuzzles = (categoryId: CategoryId) =>
    filterWordPuzzlesByCategory(dependencies.puzzles, categoryId);

  return create<WordGameSessionStore>()((set, get) => ({
    ...createInitialState(),

    startSession: (input, startedAtMs) => {
      const timestampMs = normalizeTimestamp(startedAtMs, dependencies.now);
      const puzzles = getCategoryPuzzles(input.categoryId);

      if (puzzles.length === 0) {
        return false;
      }

      const queue = createWordPuzzleQueue(
        puzzles.map((puzzle) => puzzle.id),
        { random: dependencies.random },
      );
      const draw = drawPuzzle(queue, puzzles, dependencies.random);

      if (!draw) {
        return false;
      }

      set({
        ...createInitialState(),
        mode: input.mode,
        selectedCategoryId: input.categoryId,
        status: "playing",
        currentPuzzle: draw.puzzle,
        puzzleQueue: draw.queue,
        letterTiles: createLetterTiles(draw.puzzle, dependencies.random),
        currentRound: 1,
        pendingBotAnswer:
          input.mode === "duel-demo" ? createPendingWordBotAnswer(dependencies.random) : null,
        sessionStartedAtMs: timestampMs,
        puzzleStartedAtMs: timestampMs,
      });

      emit({
        type: "session-started",
        mode: input.mode,
        categoryId: input.categoryId,
        timestampMs,
      });
      emit({
        type: "puzzle-presented",
        mode: input.mode,
        puzzleId: draw.puzzle.id,
        round: 1,
        cycle: draw.queue.cycle,
        timestampMs,
      });
      return true;
    },

    selectTile: (tileId) => {
      const state = get();

      if (state.status !== "playing" || !state.currentPuzzle || state.playerAnswer) {
        return false;
      }

      const selectedTileIds = addLetterTile(
        state.selectedTileIds,
        tileId,
        state.letterTiles,
        getWordLength(state.currentPuzzle.answer),
      );

      if (selectedTileIds.length === state.selectedTileIds.length) {
        return false;
      }

      set({ selectedTileIds });
      return true;
    },

    removeTile: (tileId) => {
      const state = get();

      if (state.status !== "playing" || state.playerAnswer) {
        return false;
      }

      const selectedTileIds = removeLetterTile(state.selectedTileIds, tileId);

      if (selectedTileIds.length === state.selectedTileIds.length) {
        return false;
      }

      set({ selectedTileIds });
      return true;
    },

    clearSelection: () => {
      const state = get();

      if (state.status === "playing" && !state.playerAnswer && state.selectedTileIds.length > 0) {
        set({ selectedTileIds: [] });
      }
    },

    submitAnswer: (answeredAtMs) => {
      const state = get();

      if (
        state.status !== "playing" ||
        !state.currentPuzzle ||
        state.puzzleStartedAtMs === null ||
        state.playerAnswer ||
        state.selectedTileIds.length !== getWordLength(state.currentPuzzle.answer)
      ) {
        return false;
      }

      const timestampMs = normalizeTimestamp(answeredAtMs, dependencies.now);
      const responseTimeMs = getWordResponseTimeMs(state.puzzleStartedAtMs, timestampMs);
      const submittedWord = buildWordFromTiles(state.letterTiles, state.selectedTileIds);
      const isCorrect = isCorrectWord(state.currentPuzzle, submittedWord);
      const playerAnswer: WordPlayerAnswer = {
        puzzleId: state.currentPuzzle.id,
        selectedTileIds: [...state.selectedTileIds],
        submittedWord,
        correctWord: state.currentPuzzle.answer,
        isCorrect,
        responseTimeMs,
      };
      const playerStats = addWordAnswerToStats(state.playerStats, isCorrect, responseTimeMs);
      const playerLives =
        state.mode === "duel-demo" && !isCorrect
          ? Math.max(0, state.playerLives - 1)
          : state.playerLives;
      const resolvedBot = resolveBotIfDue(state, timestampMs);
      const botAnswer = resolvedBot?.answer ?? state.botAnswer;
      const botStats = resolvedBot?.stats ?? state.botStats;
      const botLives = resolvedBot?.lives ?? state.botLives;
      const settlement =
        state.mode === "duel-demo"
          ? settleDuel(state, playerAnswer, botAnswer, playerLives, botLives, playerStats, botStats)
          : null;
      const status = state.mode === "solo" ? "feedback" : (settlement?.status ?? "playing");

      set({
        status,
        playerAnswer,
        playerStats,
        playerLives,
        botAnswer,
        botStats,
        botLives,
        pendingBotAnswer: status === "finished" || resolvedBot ? null : state.pendingBotAnswer,
        feedback: state.mode === "solo" ? createFeedback(state, submittedWord, isCorrect) : null,
        duelResult: settlement?.result ?? null,
        finishReason: settlement?.finishReason ?? null,
        elapsedResponseTimeMs: responseTimeMs,
        finishedAtMs: status === "finished" ? timestampMs : null,
      });

      if (resolvedBot) {
        emit({
          type: "answer-recorded",
          actor: "bot",
          puzzleId: state.currentPuzzle.id,
          round: state.currentRound,
          isCorrect: resolvedBot.answer.isCorrect,
          responseTimeMs: resolvedBot.answer.responseTimeMs,
          timestampMs: state.puzzleStartedAtMs + resolvedBot.answer.responseTimeMs,
        });
      }
      emit({
        type: "answer-recorded",
        actor: "player",
        puzzleId: state.currentPuzzle.id,
        round: state.currentRound,
        isCorrect,
        responseTimeMs,
        timestampMs,
      });

      if (state.mode === "duel-demo" && botAnswer) {
        emit({
          type: "round-completed",
          puzzleId: state.currentPuzzle.id,
          round: state.currentRound,
          timestampMs,
        });
      }

      if (settlement?.result && settlement.finishReason) {
        emit({
          type: "session-finished",
          mode: state.mode,
          reason: settlement.finishReason,
          roundsPlayed: state.currentRound,
          winner: settlement.result.winner,
          timestampMs,
        });
      }
      return true;
    },

    tick: (atMs) => {
      const state = get();

      if (state.status !== "playing" || !state.currentPuzzle || state.puzzleStartedAtMs === null) {
        return;
      }

      const timestampMs = normalizeTimestamp(atMs, dependencies.now);
      const elapsedResponseTimeMs = state.playerAnswer
        ? state.elapsedResponseTimeMs
        : getWordResponseTimeMs(state.puzzleStartedAtMs, timestampMs);
      const resolvedBot = resolveBotIfDue(state, timestampMs);

      if (!resolvedBot) {
        if (elapsedResponseTimeMs !== state.elapsedResponseTimeMs) {
          set({ elapsedResponseTimeMs });
        }
        return;
      }

      const settlement = settleDuel(
        state,
        state.playerAnswer,
        resolvedBot.answer,
        state.playerLives,
        resolvedBot.lives,
        state.playerStats,
        resolvedBot.stats,
      );

      set({
        status: settlement.status,
        botAnswer: resolvedBot.answer,
        botStats: resolvedBot.stats,
        botLives: resolvedBot.lives,
        pendingBotAnswer: null,
        duelResult: settlement.result,
        finishReason: settlement.finishReason,
        elapsedResponseTimeMs,
        finishedAtMs: settlement.status === "finished" ? timestampMs : null,
      });

      emit({
        type: "answer-recorded",
        actor: "bot",
        puzzleId: state.currentPuzzle.id,
        round: state.currentRound,
        isCorrect: resolvedBot.answer.isCorrect,
        responseTimeMs: resolvedBot.answer.responseTimeMs,
        timestampMs: state.puzzleStartedAtMs + resolvedBot.answer.responseTimeMs,
      });

      if (state.playerAnswer) {
        emit({
          type: "round-completed",
          puzzleId: state.currentPuzzle.id,
          round: state.currentRound,
          timestampMs,
        });
      }

      if (settlement.result && settlement.finishReason) {
        emit({
          type: "session-finished",
          mode: state.mode,
          reason: settlement.finishReason,
          roundsPlayed: state.currentRound,
          winner: settlement.result.winner,
          timestampMs,
        });
      }
    },

    advance: (startedAtMs) => {
      const state = get();
      const canAdvance =
        (state.mode === "solo" && state.status === "feedback") ||
        (state.mode === "duel-demo" && state.status === "round-result");

      if (!canAdvance || !state.puzzleQueue) {
        return false;
      }

      const timestampMs = normalizeTimestamp(startedAtMs, dependencies.now);
      const puzzles = getCategoryPuzzles(state.selectedCategoryId);
      const draw = drawPuzzle(state.puzzleQueue, puzzles, dependencies.random);

      if (!draw) {
        return false;
      }

      set({
        status: "playing",
        currentPuzzle: draw.puzzle,
        puzzleQueue: draw.queue,
        letterTiles: createLetterTiles(draw.puzzle, dependencies.random),
        selectedTileIds: [],
        currentRound: state.currentRound + 1,
        playerAnswer: null,
        botAnswer: null,
        pendingBotAnswer:
          state.mode === "duel-demo" ? createPendingWordBotAnswer(dependencies.random) : null,
        feedback: null,
        duelResult: null,
        finishReason: null,
        elapsedResponseTimeMs: 0,
        puzzleStartedAtMs: timestampMs,
        finishedAtMs: null,
      });

      emit({
        type: "puzzle-presented",
        mode: state.mode,
        puzzleId: draw.puzzle.id,
        round: state.currentRound + 1,
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
        feedback: null,
        finishReason: "manual",
        finishedAtMs: timestampMs,
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

/** In-memory singleton. No persistence or real multiplayer is implied. */
export const useWordGameSessionStore = createWordGameSessionStore();
