import { describe, expect, it } from "vitest";

import { wordPuzzles } from "./puzzles";
import {
  addLetterTile,
  buildWordFromTiles,
  createLetterTiles,
  getWordLength,
  isCorrectTileSelection,
  isCorrectWord,
  normalizeWord,
  removeLetterTile,
} from "./word";

const getPuzzle = (id: string) => {
  const puzzle = wordPuzzles.find((candidate) => candidate.id === id);

  if (!puzzle) {
    throw new Error(`Missing fixture ${id}`);
  }

  return puzzle;
};

describe("word normalization", () => {
  it("normalizes case and separators but preserves Russian ё", () => {
    expect(normalizeWord("  сине-зелёный! ")).toBe("СИНЕЗЕЛЁНЫЙ");
    expect(getWordLength("ёж")).toBe(2);
  });

  it("checks a normalized candidate against the puzzle answer", () => {
    const puzzle = getPuzzle("science-atom");

    expect(isCorrectWord(puzzle, "а-том")).toBe(true);
    expect(isCorrectWord(puzzle, "молекула")).toBe(false);
    expect(isCorrectWord(puzzle, "123АТОМ!? ")).toBe(false);
  });
});

describe("letter tiles", () => {
  it("creates shuffled, uniquely identified tiles including distractors", () => {
    const puzzle = getPuzzle("sport-racket");
    const tiles = createLetterTiles(puzzle, () => 0);
    const expectedCount =
      getWordLength(puzzle.answer) +
      (puzzle.distractorLetters ?? []).reduce((count, letter) => count + getWordLength(letter), 0);

    expect(tiles).toHaveLength(expectedCount);
    expect(new Set(tiles.map((tile) => tile.id)).size).toBe(tiles.length);
    expect(tiles.filter((tile) => tile.letter === "К")).toHaveLength(2);
    expect(tiles.filter((tile) => tile.letter === "А")).toHaveLength(2);
  });

  it("adds each tile once, respects the slot limit, and removes by id", () => {
    const puzzle = getPuzzle("science-atom");
    const tiles = createLetterTiles(puzzle, () => 0);
    const firstId = tiles[0]?.id;
    const secondId = tiles[1]?.id;

    if (!firstId || !secondId) {
      throw new Error("Expected at least two letter tiles");
    }

    const one = addLetterTile([], firstId, tiles, 1);

    expect(addLetterTile(one, firstId, tiles, 1)).toEqual(one);
    expect(addLetterTile(one, secondId, tiles, 1)).toEqual(one);
    expect(addLetterTile([], "missing", tiles, 1)).toEqual([]);
    expect(removeLetterTile(one, firstId)).toEqual([]);
  });

  it("builds and checks a word while preserving duplicate tile identity", () => {
    const puzzle = getPuzzle("sport-racket");
    const tiles = createLetterTiles(puzzle, () => 0.5);
    const selected: string[] = [];

    for (const letter of normalizeWord(puzzle.answer)) {
      const tile = tiles.find(
        (candidate) => candidate.letter === letter && !selected.includes(candidate.id),
      );

      if (!tile) {
        throw new Error(`Missing tile for ${letter}`);
      }

      selected.push(tile.id);
    }

    expect(buildWordFromTiles(tiles, selected)).toBe("РАКЕТКА");
    expect(isCorrectTileSelection(puzzle, tiles, selected)).toBe(true);
    expect(new Set(selected).size).toBe(selected.length);
  });
});
