export const GAME_PRODUCT_IDS = ["two-pictures", "four-pictures-word"] as const;

export type GameProductId = (typeof GAME_PRODUCT_IDS)[number];

export interface GameProduct {
  id: GameProductId;
  code: string;
  title: string;
  shortTitle: string;
  description: string;
}
