export const WORD_DUEL_ROUND_COUNT = 8;
export const WORD_DUEL_STARTING_LIVES = 3;

/** Demo-bot timing only; the player has no answer deadline. */
export const WORD_BOT_RESPONSE_RANGE_MS = {
  min: 2_400,
  max: 6_200,
} as const;

export const WORD_BOT_CORRECT_PROBABILITY = 0.62;
