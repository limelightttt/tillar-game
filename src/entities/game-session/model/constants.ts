export const DUEL_ROUND_COUNT = 8;
export const DUEL_STARTING_LIVES = 3;

/** Demo-only bot timing; it is not a player answer deadline. */
export const BOT_RESPONSE_RANGE_MS = {
  min: 1_800,
  max: 5_200,
} as const;

/** Demo-only difficulty, replaceable when an authoritative multiplayer exists. */
export const BOT_CORRECT_PROBABILITY = 0.68;
