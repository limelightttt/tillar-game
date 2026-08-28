import { describe, expect, it } from "vitest";

import { CATEGORY_IDS } from "@/entities/question";

import { wordPuzzles } from "./puzzles";
import { filterWordPuzzlesByCategory } from "./selectors";
import { normalizeWord } from "./word";

type PuzzleAnswer = (typeof wordPuzzles)[number]["answer"];

const answerDisclosureStems = {
  АЛГОРИТМ: ["алгоритм"],
  АТОМ: ["атом"],
  ГАГАРИН: ["гагарин"],
  ГЕНИЙ: ["гени"],
  ГОРА: ["гор"],
  КАДР: ["кадр"],
  КОРОНА: ["корон"],
  ЛЕТОПИСЬ: ["летопис"],
  МАРАФОН: ["марафон"],
  МЕЛОДИЯ: ["мелод"],
  МОЗАИКА: ["мозаик"],
  ОКЕАН: ["океан"],
  ПЛАНЕТА: ["планет"],
  ПОРТРЕТ: ["портрет"],
  РАКЕТКА: ["ракетк"],
  РЕГИСТАН: ["регистан"],
  РИТМ: ["ритм"],
  РОБОТ: ["робот"],
  СУМАЛЯК: ["сумаляк"],
  СЦЕНАРИЙ: ["сценар"],
} as const satisfies Record<PuzzleAnswer, readonly string[]>;

describe("word puzzle fixtures", () => {
  it("contains at least twenty valid four-image Russian puzzles", () => {
    expect(wordPuzzles.length).toBeGreaterThanOrEqual(20);
    expect(new Set(wordPuzzles.map((puzzle) => puzzle.id)).size).toBe(wordPuzzles.length);

    for (const puzzle of wordPuzzles) {
      expect(puzzle.images).toHaveLength(4);
      expect(new Set(puzzle.images.map((image) => image.id)).size).toBe(4);
      expect(normalizeWord(puzzle.answer)).toMatch(/^[А-ЯЁ]+$/u);
      expect(puzzle.distractorLetters?.length).toBeGreaterThan(0);
      expect(puzzle.distractorLetters?.every((letter) => normalizeWord(letter).length > 0)).toBe(
        true,
      );
      expect(puzzle.explanation.length).toBeGreaterThan(20);
    }
  });

  it("has at least two puzzles in every current category except the all selector", () => {
    for (const categoryId of CATEGORY_IDS) {
      if (categoryId !== "all") {
        expect(
          wordPuzzles.filter((puzzle) => puzzle.categoryId === categoryId).length,
        ).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it("keeps target words and their obvious forms out of accessible image descriptions", () => {
    for (const puzzle of wordPuzzles) {
      for (const image of puzzle.images) {
        const normalizedAlt = image.alt.normalize("NFC").toLocaleLowerCase("ru-RU");

        expect(image.alt.trim().length).toBeGreaterThan(0);
        for (const stem of answerDisclosureStems[puzzle.answer]) {
          expect(normalizedAlt).not.toContain(stem);
        }
      }
    }
  });

  it("supports all and individual category filters", () => {
    expect(filterWordPuzzlesByCategory(wordPuzzles, "all")).toHaveLength(wordPuzzles.length);
    expect(
      filterWordPuzzlesByCategory(wordPuzzles, "geography").every(
        (puzzle) => puzzle.categoryId === "geography",
      ),
    ).toBe(true);
  });
});
