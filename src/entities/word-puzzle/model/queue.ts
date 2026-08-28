import type {
  CreateWordPuzzleQueueOptions,
  RandomSource,
  TakeNextWordPuzzleResult,
  WordPuzzleId,
  WordPuzzleQueue,
} from "./types";

const uniquePuzzleIds = (puzzleIds: readonly WordPuzzleId[]): WordPuzzleId[] => [
  ...new Set(puzzleIds),
];

const randomIndex = (random: RandomSource, upperBound: number): number => {
  const value = random();
  const normalized = Number.isFinite(value) ? Math.min(Math.max(value, 0), 1 - Number.EPSILON) : 0;

  return Math.floor(normalized * upperBound);
};

export const buildWordPuzzleCycle = (
  puzzleIds: readonly WordPuzzleId[],
  previousPuzzleId: WordPuzzleId | null = null,
  random: RandomSource = Math.random,
): WordPuzzleId[] => {
  const shuffledIds = uniquePuzzleIds(puzzleIds);

  for (let index = shuffledIds.length - 1; index > 0; index -= 1) {
    const swapIndex = randomIndex(random, index + 1);
    [shuffledIds[index], shuffledIds[swapIndex]] = [shuffledIds[swapIndex], shuffledIds[index]];
  }

  if (shuffledIds.length > 1 && shuffledIds[0] === previousPuzzleId) {
    const replacementIndex = shuffledIds.findIndex((id) => id !== previousPuzzleId);
    [shuffledIds[0], shuffledIds[replacementIndex]] = [
      shuffledIds[replacementIndex],
      shuffledIds[0],
    ];
  }

  return shuffledIds;
};

export const createWordPuzzleQueue = (
  puzzleIds: readonly WordPuzzleId[],
  options: CreateWordPuzzleQueueOptions = {},
): WordPuzzleQueue => {
  const pool = uniquePuzzleIds(puzzleIds);
  const previousPuzzleId = options.previousPuzzleId ?? null;

  return {
    pool,
    remaining: buildWordPuzzleCycle(pool, previousPuzzleId, options.random),
    lastPuzzleId: previousPuzzleId,
    cycle: 0,
  };
};

export const takeNextWordPuzzle = (
  queue: WordPuzzleQueue,
  random: RandomSource = Math.random,
): TakeNextWordPuzzleResult => {
  const startsNewCycle = queue.remaining.length === 0;
  const remaining = startsNewCycle
    ? buildWordPuzzleCycle(queue.pool, queue.lastPuzzleId, random)
    : [...queue.remaining];
  const [puzzleId, ...nextRemaining] = remaining;

  if (puzzleId === undefined) {
    return { puzzleId: null, queue };
  }

  return {
    puzzleId,
    queue: {
      ...queue,
      remaining: nextRemaining,
      lastPuzzleId: puzzleId,
      cycle: queue.cycle + (startsNewCycle ? 1 : 0),
    },
  };
};
