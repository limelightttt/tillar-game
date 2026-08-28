import type { CategoryId } from "@/entities/question";

import type { WordPuzzle, WordPuzzleId } from "./types";

export const filterWordPuzzlesByCategory = (
  puzzles: readonly WordPuzzle[],
  categoryId: CategoryId,
): WordPuzzle[] =>
  categoryId === "all"
    ? [...puzzles]
    : puzzles.filter((puzzle) => puzzle.categoryId === categoryId);

export const getWordPuzzleById = (
  puzzles: readonly WordPuzzle[],
  puzzleId: WordPuzzleId,
): WordPuzzle | undefined => puzzles.find((puzzle) => puzzle.id === puzzleId);
