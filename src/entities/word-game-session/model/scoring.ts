import type { WordAnswerStats, WordDuelWinner } from "./types";

export const createEmptyWordAnswerStats = (): WordAnswerStats => ({
  answered: 0,
  correct: 0,
  errors: 0,
  totalResponseTimeMs: 0,
  averageResponseTimeMs: 0,
  streak: 0,
  bestStreak: 0,
});

export const addWordAnswerToStats = (
  stats: WordAnswerStats,
  isCorrect: boolean,
  responseTimeMs: number,
): WordAnswerStats => {
  const safeTimeMs = Math.max(0, responseTimeMs);
  const answered = stats.answered + 1;
  const correct = stats.correct + (isCorrect ? 1 : 0);
  const errors = stats.errors + (isCorrect ? 0 : 1);
  const totalResponseTimeMs = stats.totalResponseTimeMs + safeTimeMs;
  const streak = isCorrect ? stats.streak + 1 : 0;

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

export const determineWordDuelWinner = (
  player: WordAnswerStats,
  bot: WordAnswerStats,
): WordDuelWinner => {
  if (player.correct !== bot.correct) {
    return player.correct > bot.correct ? "player" : "bot";
  }

  if (player.totalResponseTimeMs !== bot.totalResponseTimeMs) {
    return player.totalResponseTimeMs < bot.totalResponseTimeMs ? "player" : "bot";
  }

  return "draw";
};

export const determineWordEliminationWinner = (
  playerLives: number,
  botLives: number,
  player: WordAnswerStats,
  bot: WordAnswerStats,
): WordDuelWinner => {
  if (playerLives === 0 && botLives > 0) {
    return "bot";
  }

  if (botLives === 0 && playerLives > 0) {
    return "player";
  }

  return determineWordDuelWinner(player, bot);
};
