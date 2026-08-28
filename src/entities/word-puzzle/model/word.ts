import type { LetterTile, LetterTileId, RandomSource, WordPuzzle } from "./types";

const RUSSIAN_LETTER_PATTERN = /[А-ЯЁ]/gu;
const RUSSIAN_WORD_INPUT_PATTERN = /^[А-ЯЁ\s-]+$/iu;

export const normalizeWord = (value: string): string =>
  (value.normalize("NFC").toLocaleUpperCase("ru-RU").match(RUSSIAN_LETTER_PATTERN) ?? []).join("");

export const getWordLength = (value: string): number => [...normalizeWord(value)].length;

const toUnitInterval = (value: number): number => {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(Math.max(value, 0), 1 - Number.EPSILON);
};

export const shuffleLetters = (
  letters: readonly string[],
  random: RandomSource = Math.random,
): string[] => {
  const shuffled = [...letters];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(toUnitInterval(random()) * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
};

export const createLetterTiles = (
  puzzle: WordPuzzle,
  random: RandomSource = Math.random,
): LetterTile[] => {
  const letters = [
    ...normalizeWord(puzzle.answer),
    ...(puzzle.distractorLetters ?? []).flatMap((letter) => [...normalizeWord(letter)]),
  ];

  return shuffleLetters(letters, random).map((letter, index) => ({
    id: `${puzzle.id}:tile:${index}`,
    letter,
  }));
};

export const addLetterTile = (
  selectedTileIds: readonly LetterTileId[],
  tileId: LetterTileId,
  tiles: readonly LetterTile[],
  maximumLength = Number.POSITIVE_INFINITY,
): LetterTileId[] => {
  const isAvailable = tiles.some((tile) => tile.id === tileId);

  if (!isAvailable || selectedTileIds.includes(tileId) || selectedTileIds.length >= maximumLength) {
    return [...selectedTileIds];
  }

  return [...selectedTileIds, tileId];
};

export const removeLetterTile = (
  selectedTileIds: readonly LetterTileId[],
  tileId: LetterTileId,
): LetterTileId[] => selectedTileIds.filter((selectedId) => selectedId !== tileId);

export const buildWordFromTiles = (
  tiles: readonly LetterTile[],
  selectedTileIds: readonly LetterTileId[],
): string => {
  const tilesById = new Map(tiles.map((tile) => [tile.id, tile]));

  return normalizeWord(
    selectedTileIds.map((tileId) => tilesById.get(tileId)?.letter ?? "").join(""),
  );
};

export const isCorrectWord = (puzzle: WordPuzzle, candidate: string): boolean => {
  const normalizedCandidate = candidate.normalize("NFC").trim();

  return (
    normalizedCandidate.length > 0 &&
    RUSSIAN_WORD_INPUT_PATTERN.test(normalizedCandidate) &&
    normalizeWord(normalizedCandidate) === normalizeWord(puzzle.answer)
  );
};

export const isCorrectTileSelection = (
  puzzle: WordPuzzle,
  tiles: readonly LetterTile[],
  selectedTileIds: readonly LetterTileId[],
): boolean => isCorrectWord(puzzle, buildWordFromTiles(tiles, selectedTileIds));
