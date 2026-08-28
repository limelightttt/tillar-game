import type { QuestionCategoryId } from "@/entities/question";

export type WordPuzzleId = string;
export type WordPuzzleImageId = string;
export type LetterTileId = string;

export interface WordPuzzleImage {
  readonly id: WordPuzzleImageId;
  readonly visualKey: string;
  /** Optional local fallback; production content can provide `src` from a CMS/media service. */
  readonly symbol?: string;
  readonly src?: string;
  readonly alt: string;
}

export interface WordPuzzle {
  readonly id: WordPuzzleId;
  readonly categoryId: QuestionCategoryId;
  readonly prompt: string;
  readonly images: readonly [WordPuzzleImage, WordPuzzleImage, WordPuzzleImage, WordPuzzleImage];
  readonly answer: string;
  readonly distractorLetters?: readonly string[];
  readonly explanation: string;
}

export interface LetterTile {
  readonly id: LetterTileId;
  readonly letter: string;
}

export type RandomSource = () => number;

export interface WordPuzzleQueue {
  readonly pool: readonly WordPuzzleId[];
  readonly remaining: readonly WordPuzzleId[];
  readonly lastPuzzleId: WordPuzzleId | null;
  readonly cycle: number;
}

export interface CreateWordPuzzleQueueOptions {
  readonly previousPuzzleId?: WordPuzzleId | null;
  readonly random?: RandomSource;
}

export interface TakeNextWordPuzzleResult {
  readonly puzzleId: WordPuzzleId | null;
  readonly queue: WordPuzzleQueue;
}
