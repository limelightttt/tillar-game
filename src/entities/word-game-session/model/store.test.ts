import { describe, expect, it } from "vitest";

import { normalizeWord, type WordPuzzle, wordPuzzles } from "@/entities/word-puzzle";

import { WORD_BOT_RESPONSE_RANGE_MS, WORD_DUEL_ROUND_COUNT } from "./constants";
import { createWordGameSessionStore } from "./store";

type TestStore = ReturnType<typeof createWordGameSessionStore>;

const currentPuzzle = (store: TestStore): WordPuzzle => {
  const puzzle = store.getState().currentPuzzle;

  if (!puzzle) {
    throw new Error("Expected an active word puzzle");
  }

  return puzzle;
};

const tileIdsForAnswer = (store: TestStore): string[] => {
  const puzzle = currentPuzzle(store);
  const { letterTiles } = store.getState();
  const selected: string[] = [];

  for (const letter of normalizeWord(puzzle.answer)) {
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

const selectIds = (store: TestStore, tileIds: readonly string[]) => {
  for (const tileId of tileIds) {
    expect(store.getState().selectTile(tileId)).toBe(true);
  }
};

const selectCorrectAnswer = (store: TestStore) => {
  selectIds(store, tileIdsForAnswer(store));
};

const selectWrongAnswer = (store: TestStore) => {
  const ids = tileIdsForAnswer(store);
  const firstDifferentIndex = ids.findIndex(
    (tileId, index) =>
      index > 0 &&
      store.getState().letterTiles.find((tile) => tile.id === tileId)?.letter !==
        store.getState().letterTiles.find((tile) => tile.id === ids[0])?.letter,
  );

  if (firstDifferentIndex < 1) {
    throw new Error("Fixture answer must contain at least two distinct letters");
  }

  [ids[0], ids[firstDifferentIndex]] = [ids[firstDifferentIndex], ids[0]];
  selectIds(store, ids);
};

describe("word solo session", () => {
  it("supports tile add/remove/clear and requires all answer slots", () => {
    const store = createWordGameSessionStore({ random: () => 0 });
    store.getState().startSession({ mode: "solo", categoryId: "all" }, 0);
    const firstId = store.getState().letterTiles[0]?.id;

    if (!firstId) {
      throw new Error("Expected a letter tile");
    }

    expect(store.getState().submitAnswer(100)).toBe(false);
    expect(store.getState().selectTile(firstId)).toBe(true);
    expect(store.getState().selectTile(firstId)).toBe(false);
    expect(store.getState().removeTile(firstId)).toBe(true);
    expect(store.getState().removeTile(firstId)).toBe(false);
    expect(store.getState().selectTile(firstId)).toBe(true);
    store.getState().clearSelection();
    expect(store.getState().selectedTileIds).toEqual([]);
  });

  it("shows full educational feedback and finishes only manually", () => {
    const store = createWordGameSessionStore({ random: () => 0 });
    store.getState().startSession({ mode: "solo", categoryId: "all" }, 1_000);
    const puzzle = currentPuzzle(store);
    selectWrongAnswer(store);
    store.getState().tick(121_000);
    expect(store.getState().submitAnswer(121_000)).toBe(true);

    expect(store.getState().status).toBe("feedback");
    expect(store.getState().feedback).toEqual({
      kind: "incorrect",
      submittedWord: store.getState().playerAnswer?.submittedWord,
      correctWord: puzzle.answer,
      explanation: puzzle.explanation,
    });
    expect(store.getState().playerStats.errors).toBe(1);
    expect(store.getState().elapsedResponseTimeMs).toBe(120_000);
    expect(store.getState().playerLives).toBe(3);
    expect(store.getState().finishSolo(122_000)).toBe(true);
    expect(store.getState().finishReason).toBe("manual");
  });

  it("shows the correct word and explanation after a correct answer", () => {
    const store = createWordGameSessionStore({ random: () => 0 });
    store.getState().startSession({ mode: "solo", categoryId: "all" }, 0);
    const puzzle = currentPuzzle(store);
    selectCorrectAnswer(store);
    expect(store.getState().submitAnswer(750)).toBe(true);

    expect(store.getState().feedback).toEqual({
      kind: "correct",
      submittedWord: normalizeWord(puzzle.answer),
      correctWord: puzzle.answer,
      explanation: puzzle.explanation,
    });
    expect(store.getState().playerStats.correct).toBe(1);
    expect(store.getState().playerStats.streak).toBe(1);
  });

  it("exhausts the selected pool before a puzzle repeats", () => {
    const store = createWordGameSessionStore({ random: () => 0 });
    const seen = new Set<string>();
    let now = 0;
    store.getState().startSession({ mode: "solo", categoryId: "all" }, now);

    for (const _fixture of wordPuzzles) {
      seen.add(currentPuzzle(store).id);
      selectCorrectAnswer(store);
      now += 100;
      expect(store.getState().submitAnswer(now)).toBe(true);
      now += 1;
      expect(store.getState().advance(now)).toBe(true);
    }

    expect(seen.size).toBe(wordPuzzles.length);
    expect(seen.has(currentPuzzle(store).id)).toBe(true);
  });

  it("keeps fixture injection replaceable and rejects an empty category", () => {
    const store = createWordGameSessionStore({ puzzles: [] });

    expect(store.getState().startSession({ mode: "solo", categoryId: "all" }, 0)).toBe(false);
    expect(store.getState().status).toBe("idle");
  });
});

describe("word duel demo", () => {
  it("waits for both answers, removes a player life, and omits feedback", () => {
    const store = createWordGameSessionStore({ random: () => 0 });
    store.getState().startSession({ mode: "duel-demo", categoryId: "all" }, 0);
    selectWrongAnswer(store);
    expect(store.getState().submitAnswer(500)).toBe(true);

    expect(store.getState().status).toBe("playing");
    expect(store.getState().playerLives).toBe(2);
    expect(store.getState().feedback).toBeNull();
    expect(store.getState().advance(600)).toBe(false);

    store.getState().tick(WORD_BOT_RESPONSE_RANGE_MS.min);
    expect(store.getState().status).toBe("round-result");
    expect(store.getState().botAnswer?.isCorrect).toBe(true);
    expect(store.getState().advance(WORD_BOT_RESPONSE_RANGE_MS.min + 1)).toBe(true);
  });

  it("ends immediately when the player loses the third life", () => {
    const store = createWordGameSessionStore({ random: () => 0 });
    let roundStartedAt = 0;
    store.getState().startSession({ mode: "duel-demo", categoryId: "all" }, roundStartedAt);

    for (let round = 1; round <= 3; round += 1) {
      selectWrongAnswer(store);
      expect(store.getState().submitAnswer(roundStartedAt + 100)).toBe(true);

      if (round < 3) {
        store.getState().tick(roundStartedAt + WORD_BOT_RESPONSE_RANGE_MS.min);
        roundStartedAt += WORD_BOT_RESPONSE_RANGE_MS.min + 10;
        store.getState().advance(roundStartedAt);
      }
    }

    expect(store.getState().status).toBe("finished");
    expect(store.getState().playerLives).toBe(0);
    expect(store.getState().botLives).toBe(3);
    expect(store.getState().duelResult).toEqual({
      winner: "bot",
      roundsPlayed: 3,
      reason: "out-of-lives",
    });
    expect(store.getState().botAnswer).toBeNull();
  });

  it("falls back to score/time when both lose their last life together", () => {
    const store = createWordGameSessionStore({ random: () => 1 });
    let roundStartedAt = 0;
    store.getState().startSession({ mode: "duel-demo", categoryId: "all" }, roundStartedAt);

    for (let round = 1; round <= 3; round += 1) {
      selectWrongAnswer(store);
      expect(store.getState().submitAnswer(roundStartedAt + WORD_BOT_RESPONSE_RANGE_MS.max)).toBe(
        true,
      );

      if (round < 3) {
        roundStartedAt += WORD_BOT_RESPONSE_RANGE_MS.max + 10;
        store.getState().advance(roundStartedAt);
      }
    }

    expect(store.getState().playerLives).toBe(0);
    expect(store.getState().botLives).toBe(0);
    expect(store.getState().duelResult?.winner).toBe("draw");
  });

  it("ends immediately when the bot loses its third life first", () => {
    const store = createWordGameSessionStore({ random: () => 1 });
    let roundStartedAt = 0;
    store.getState().startSession({ mode: "duel-demo", categoryId: "all" }, roundStartedAt);

    for (let round = 1; round <= 2; round += 1) {
      selectWrongAnswer(store);
      store.getState().submitAnswer(roundStartedAt + 100);
      store.getState().tick(roundStartedAt + WORD_BOT_RESPONSE_RANGE_MS.max);
      roundStartedAt += WORD_BOT_RESPONSE_RANGE_MS.max + 10;
      store.getState().advance(roundStartedAt);
    }

    store.getState().tick(roundStartedAt + WORD_BOT_RESPONSE_RANGE_MS.max);

    expect(store.getState().status).toBe("finished");
    expect(store.getState().botLives).toBe(0);
    expect(store.getState().playerLives).toBe(1);
    expect(store.getState().playerAnswer).toBeNull();
    expect(store.getState().duelResult).toEqual({
      winner: "player",
      roundsPlayed: 3,
      reason: "out-of-lives",
    });
  });

  it("finishes a surviving duel after eight rounds", () => {
    const store = createWordGameSessionStore({ random: () => 0 });
    let roundStartedAt = 0;
    store.getState().startSession({ mode: "duel-demo", categoryId: "all" }, roundStartedAt);

    for (let round = 1; round <= WORD_DUEL_ROUND_COUNT; round += 1) {
      selectCorrectAnswer(store);
      expect(store.getState().submitAnswer(roundStartedAt + WORD_BOT_RESPONSE_RANGE_MS.min)).toBe(
        true,
      );

      if (round < WORD_DUEL_ROUND_COUNT) {
        expect(store.getState().status).toBe("round-result");
        roundStartedAt += WORD_BOT_RESPONSE_RANGE_MS.min + 10;
        store.getState().advance(roundStartedAt);
      }
    }

    expect(store.getState().status).toBe("finished");
    expect(store.getState().currentRound).toBe(WORD_DUEL_ROUND_COUNT);
    expect(store.getState().finishReason).toBe("rounds-completed");
    expect(store.getState().duelResult?.winner).toBe("draw");
  });
});
