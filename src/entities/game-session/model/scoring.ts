import type { AnswerStats, DuelWinner } from "./types";

export const createEmptyAnswerStats = (): AnswerStats => ({
  answered: 0,
  correct: 0,
  errors: 0,
  totalResponseTimeMs: 0,
  averageResponseTimeMs: 0,
  streak: 0,
  bestStreak: 0,
});

export const addAnswerToStats = (
  stats: AnswerStats,
  isCorrect: boolean,
  responseTimeMs: number,
): AnswerStats => {
  const safeResponseTimeMs = Math.max(0, responseTimeMs);
  const answered = stats.answered + 1;
  const correct = stats.correct + (isCorrect ? 1 : 0);
  const errors = stats.errors + (isCorrect ? 0 : 1);
  const streak = isCorrect ? stats.streak + 1 : 0;
  const totalResponseTimeMs = stats.totalResponseTimeMs + safeResponseTimeMs;

  return {
    answered,
    correct,
    errors,
    totalResponseTimeMs,
    averageResponseTimeMs: totalResponseTimeMs / answered,
    streak,
    bestStreak: Math.max(stats.bestStreak, streak),
  };
};

/** Correct answers win first; total response time is the only tiebreak. */
export const determineDuelWinner = (player: AnswerStats, bot: AnswerStats): DuelWinner => {
  if (player.correct !== bot.correct) {
    return player.correct > bot.correct ? "player" : "bot";
  }

  if (player.totalResponseTimeMs !== bot.totalResponseTimeMs) {
    return player.totalResponseTimeMs < bot.totalResponseTimeMs ? "player" : "bot";
  }

  return "draw";
};

/** A sole survivor wins; simultaneous elimination falls back to score/time. */
export const determineEliminationWinner = (
  playerLives: number,
  botLives: number,
  player: AnswerStats,
  bot: AnswerStats,
): DuelWinner => {
  if (playerLives === 0 && botLives > 0) {
    return "bot";
  }

  if (botLives === 0 && playerLives > 0) {
    return "player";
  }

  return determineDuelWinner(player, bot);
};
