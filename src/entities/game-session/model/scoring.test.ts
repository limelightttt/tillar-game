import { describe, expect, it } from "vitest";

import {
  addAnswerToStats,
  createEmptyAnswerStats,
  determineDuelWinner,
  determineEliminationWinner,
} from "./scoring";

describe("answer scoring", () => {
  it("tracks correct answers, errors, averages, and streaks", () => {
    let stats = createEmptyAnswerStats();

    stats = addAnswerToStats(stats, true, 600);
    stats = addAnswerToStats(stats, true, 1_000);
    stats = addAnswerToStats(stats, false, 800);

    expect(stats).toEqual({
      answered: 3,
      correct: 2,
      errors: 1,
      totalResponseTimeMs: 2_400,
      averageResponseTimeMs: 800,
      streak: 0,
      bestStreak: 2,
    });
  });

  it("never records negative response time", () => {
    const stats = addAnswerToStats(createEmptyAnswerStats(), true, -50);

    expect(stats.totalResponseTimeMs).toBe(0);
    expect(stats.averageResponseTimeMs).toBe(0);
  });
});

describe("duel winner", () => {
  it("prioritizes correct answers over response time", () => {
    const player = {
      ...createEmptyAnswerStats(),
      answered: 2,
      correct: 2,
      totalResponseTimeMs: 9_000,
    };
    const bot = {
      ...createEmptyAnswerStats(),
      answered: 2,
      correct: 1,
      totalResponseTimeMs: 1_000,
    };

    expect(determineDuelWinner(player, bot)).toBe("player");
  });

  it("uses lower total response time and preserves an exact draw", () => {
    const player = {
      ...createEmptyAnswerStats(),
      answered: 2,
      correct: 1,
      totalResponseTimeMs: 2_000,
    };
    const slowerBot = { ...player, totalResponseTimeMs: 2_001 };

    expect(determineDuelWinner(player, slowerBot)).toBe("player");
    expect(determineDuelWinner(player, { ...player })).toBe("draw");
  });

  it("awards elimination to the sole survivor", () => {
    const equalStats = createEmptyAnswerStats();

    expect(determineEliminationWinner(0, 1, equalStats, equalStats)).toBe("bot");
    expect(determineEliminationWinner(1, 0, equalStats, equalStats)).toBe("player");
    expect(determineEliminationWinner(0, 0, equalStats, equalStats)).toBe("draw");
  });
});
