import { describe, expect, it } from "vitest";

import {
  addWordAnswerToStats,
  createEmptyWordAnswerStats,
  determineWordDuelWinner,
  determineWordEliminationWinner,
} from "./scoring";

describe("word-game scoring", () => {
  it("tracks correct, errors, average time, and streaks", () => {
    let stats = createEmptyWordAnswerStats();
    stats = addWordAnswerToStats(stats, true, 500);
    stats = addWordAnswerToStats(stats, true, 700);
    stats = addWordAnswerToStats(stats, false, 600);

    expect(stats).toEqual({
      answered: 3,
      correct: 2,
      errors: 1,
      totalResponseTimeMs: 1_800,
      averageResponseTimeMs: 600,
      streak: 0,
      bestStreak: 2,
    });
  });

  it("uses correct count before total time and draws on exact equality", () => {
    const player = {
      ...createEmptyWordAnswerStats(),
      correct: 2,
      totalResponseTimeMs: 5_000,
    };
    const fewerCorrect = {
      ...createEmptyWordAnswerStats(),
      correct: 1,
      totalResponseTimeMs: 1,
    };
    const slower = { ...player, totalResponseTimeMs: 5_001 };

    expect(determineWordDuelWinner(player, fewerCorrect)).toBe("player");
    expect(determineWordDuelWinner(player, slower)).toBe("player");
    expect(determineWordDuelWinner(player, { ...player })).toBe("draw");
  });

  it("awards an elimination to the sole survivor", () => {
    const stats = createEmptyWordAnswerStats();

    expect(determineWordEliminationWinner(0, 1, stats, stats)).toBe("bot");
    expect(determineWordEliminationWinner(1, 0, stats, stats)).toBe("player");
    expect(determineWordEliminationWinner(0, 0, stats, stats)).toBe("draw");
  });
});
