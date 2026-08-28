import { WORD_BOT_CORRECT_PROBABILITY, WORD_BOT_RESPONSE_RANGE_MS } from "./constants";
import type { WordBotAnswer } from "./types";

export type WordRandomSource = () => number;

const toUnitInterval = (value: number): number => {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(Math.max(value, 0), 1 - Number.EPSILON);
};

export const createPendingWordBotAnswer = (random: WordRandomSource): WordBotAnswer => {
  const isCorrect = toUnitInterval(random()) < WORD_BOT_CORRECT_PROBABILITY;
  const timeRoll = toUnitInterval(random());
  const responseTimeMs = Math.round(
    WORD_BOT_RESPONSE_RANGE_MS.min +
      timeRoll * (WORD_BOT_RESPONSE_RANGE_MS.max - WORD_BOT_RESPONSE_RANGE_MS.min),
  );

  return { isCorrect, responseTimeMs };
};
