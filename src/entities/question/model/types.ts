export const CATEGORY_IDS = [
  "all",
  "geography",
  "history",
  "cinema",
  "music",
  "science",
  "art",
  "people",
  "sport",
  "uzbekistan",
  "technology",
] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];
export type QuestionCategoryId = Exclude<CategoryId, "all">;

export interface QuestionCategory {
  readonly id: CategoryId;
  readonly label: string;
  readonly icon: string;
}

export const PICTURE_VISUAL_KEYS = [
  "pacific-ocean",
  "atlantic-ocean",
  "eiffel-tower",
  "big-ben",
  "yuri-gagarin",
  "neil-armstrong",
  "colosseum",
  "parthenon",
  "saturn",
  "mars",
  "dolphin",
  "shark",
  "registan",
  "ichan-kala",
  "chorsu-bazaar",
  "ark-bukhara",
  "mona-lisa",
  "starry-night",
  "dutar",
  "violin",
  "shuttlecock",
  "tennis-ball",
  "ssd-drive",
  "hard-disk-drive",
  "film-clapper",
  "megaphone",
  "albert-einstein",
  "isaac-newton",
] as const;

export type PictureVisualKey = (typeof PICTURE_VISUAL_KEYS)[number];
export type QuestionId = string;
export type QuestionOptionId = string;

export interface QuestionOption {
  readonly id: QuestionOptionId;
  readonly visualKey: PictureVisualKey;
  readonly ariaLabel: string;
}

export interface IncorrectOptionExplanation {
  readonly optionId: QuestionOptionId;
  readonly text: string;
}

export interface PictureQuestion {
  readonly id: QuestionId;
  readonly categoryId: QuestionCategoryId;
  readonly prompt: string;
  readonly options: readonly [QuestionOption, QuestionOption];
  readonly correctOptionId: QuestionOptionId;
  readonly correctFact: string;
  readonly incorrectExplanation: IncorrectOptionExplanation;
}

export type Category = QuestionCategory;
export type Question = PictureQuestion;
