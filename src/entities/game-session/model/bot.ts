import { BOT_CORRECT_PROBABILITY, BOT_RESPONSE_RANGE_MS } from "./constants";
import type { PendingBotAnswer } from "./types";

export type RandomSource = () => number;

const toUnitInterval = (value: number): number => {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(Math.max(value, 0), 1 - Number.EPSILON);
};

export const createPendingBotAnswer = (random: RandomSource): PendingBotAnswer => {
  const isCorrect = toUnitInterval(random()) < BOT_CORRECT_PROBABILITY;
  const timeRoll = toUnitInterval(random());
  const responseTimeMs = Math.round(
    BOT_RESPONSE_RANGE_MS.min + timeRoll * (BOT_RESPONSE_RANGE_MS.max - BOT_RESPONSE_RANGE_MS.min),
  );

  return { isCorrect, responseTimeMs };
};
