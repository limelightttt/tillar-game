export const getWordResponseTimeMs = (puzzleStartedAtMs: number, atMs: number): number =>
  Math.max(0, atMs - puzzleStartedAtMs);
