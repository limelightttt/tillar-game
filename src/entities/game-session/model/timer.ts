export const getElapsedResponseTimeMs = (questionStartedAtMs: number, atMs: number): number =>
  Math.max(0, atMs - questionStartedAtMs);
