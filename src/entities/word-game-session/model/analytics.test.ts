import { describe, expect, it } from "vitest";

import { normalizeWord } from "@/entities/word-puzzle";

import type { WordGameSessionAnalyticsEvent } from "./analytics";
import { WORD_BOT_RESPONSE_RANGE_MS } from "./constants";
import { createWordGameSessionStore } from "./store";

type TestStore = ReturnType<typeof createWordGameSessionStore>;

const answerTileIds = (store: TestStore): string[] => {
  const { currentPuzzle, letterTiles } = store.getState();

  if (!currentPuzzle) {
    throw new Error("Expected an active puzzle");
  }

  const selected: string[] = [];

  for (const letter of normalizeWord(currentPuzzle.answer)) {
    const tile = letterTiles.find(
      (candidate) => candidate.letter === letter && !selected.includes(candidate.id),
    );

    if (!tile) {
      throw new Error(`Missing tile for ${letter}`);
    }

    selected.push(tile.id);
  }

  return selected;
};

const selectTiles = (store: TestStore, tileIds: readonly string[]) => {
  for (const tileId of tileIds) {
    store.getState().selectTile(tileId);
  }
};

const selectCorrectAnswer = (store: TestStore) => {
  selectTiles(store, answerTileIds(store));
};

const selectWrongAnswer = (store: TestStore) => {
  const tileIds = answerTileIds(store);
  const { letterTiles } = store.getState();
  const firstLetter = letterTiles.find((tile) => tile.id === tileIds[0])?.letter;
  const differentIndex = tileIds.findIndex(
    (tileId, index) =>
      index > 0 && letterTiles.find((tile) => tile.id === tileId)?.letter !== firstLetter,
  );

  if (differentIndex < 1) {
    throw new Error("Expected two distinct answer letters");
  }

  [tileIds[0], tileIds[differentIndex]] = [tileIds[differentIndex], tileIds[0]];
  selectTiles(store, tileIds);
};

describe("word-game analytics seam", () => {
  it("reports the complete solo event flow without choosing a transport", () => {
    const events: WordGameSessionAnalyticsEvent[] = [];
    const store = createWordGameSessionStore({
      analytics: (event) => events.push(event),
      random: () => 0,
    });

    expect(store.getState().startSession({ mode: "solo", categoryId: "all" }, 100)).toBe(true);
    const firstPuzzleId = store.getState().currentPuzzle?.id;
    selectCorrectAnswer(store);
    store.getState().submitAnswer(350);
    store.getState().advance(500);
    const secondPuzzleId = store.getState().currentPuzzle?.id;
    store.getState().finishSolo(700);

    expect(events).toEqual([
      {
        type: "session-started",
        mode: "solo",
        categoryId: "all",
        timestampMs: 100,
      },
      {
        type: "puzzle-presented",
        mode: "solo",
        puzzleId: firstPuzzleId,
        round: 1,
        cycle: 0,
        timestampMs: 100,
      },
      {
        type: "answer-recorded",
        actor: "player",
        puzzleId: firstPuzzleId,
        round: 1,
        isCorrect: true,
        responseTimeMs: 250,
        timestampMs: 350,
      },
      {
        type: "puzzle-presented",
        mode: "solo",
        puzzleId: secondPuzzleId,
        round: 2,
        cycle: 0,
        timestampMs: 500,
      },
      {
        type: "session-finished",
        mode: "solo",
        reason: "manual",
        roundsPlayed: 1,
        winner: null,
        timestampMs: 700,
      },
    ]);
  });

  it("reports player and bot answers before completing a duel round", () => {
    const events: WordGameSessionAnalyticsEvent[] = [];
    const store = createWordGameSessionStore({
      analytics: (event) => events.push(event),
      random: () => 0,
    });
    store.getState().startSession({ mode: "duel-demo", categoryId: "all" }, 0);
    selectCorrectAnswer(store);
    store.getState().submitAnswer(500);
    store.getState().tick(WORD_BOT_RESPONSE_RANGE_MS.min);

    expect(events.slice(2).map((event) => event.type)).toEqual([
      "answer-recorded",
      "answer-recorded",
      "round-completed",
    ]);
    expect(events[2]).toMatchObject({
      type: "answer-recorded",
      actor: "player",
      responseTimeMs: 500,
      timestampMs: 500,
    });
    expect(events[3]).toMatchObject({
      type: "answer-recorded",
      actor: "bot",
      responseTimeMs: WORD_BOT_RESPONSE_RANGE_MS.min,
      timestampMs: WORD_BOT_RESPONSE_RANGE_MS.min,
    });
    expect(events[4]).toMatchObject({
      type: "round-completed",
      round: 1,
      timestampMs: WORD_BOT_RESPONSE_RANGE_MS.min,
    });
  });

  it("reports an immediate life-elimination finish only once", () => {
    const events: WordGameSessionAnalyticsEvent[] = [];
    const store = createWordGameSessionStore({
      analytics: (event) => events.push(event),
      random: () => 0,
    });
    let roundStartedAt = 0;
    store.getState().startSession({ mode: "duel-demo", categoryId: "all" }, roundStartedAt);

    for (let round = 1; round <= 3; round += 1) {
      selectWrongAnswer(store);
      store.getState().submitAnswer(roundStartedAt + 100);

      if (round < 3) {
        store.getState().tick(roundStartedAt + WORD_BOT_RESPONSE_RANGE_MS.min);
        roundStartedAt += WORD_BOT_RESPONSE_RANGE_MS.min + 10;
        store.getState().advance(roundStartedAt);
      }
    }

    const finishedEvents = events.filter((event) => event.type === "session-finished");

    expect(finishedEvents).toEqual([
      {
        type: "session-finished",
        mode: "duel-demo",
        reason: "out-of-lives",
        roundsPlayed: 3,
        winner: "bot",
        timestampMs: roundStartedAt + 100,
      },
    ]);
    expect(events.filter((event) => event.type === "round-completed")).toHaveLength(2);
  });

  it("does not report a rejected session start", () => {
    const events: WordGameSessionAnalyticsEvent[] = [];
    const store = createWordGameSessionStore({
      analytics: (event) => events.push(event),
      puzzles: [],
    });

    expect(store.getState().startSession({ mode: "solo", categoryId: "all" }, 100)).toBe(false);
    expect(events).toEqual([]);
  });
});
