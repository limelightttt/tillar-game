import type { CategoryId, PictureQuestion, QuestionOptionId } from "./types";

export function filterQuestionsByCategory(
  questions: readonly PictureQuestion[],
  categoryId: CategoryId,
): PictureQuestion[] {
  if (categoryId === "all") {
    return [...questions];
  }

  return questions.filter((question) => question.categoryId === categoryId);
}

export function isCorrectOption(question: PictureQuestion, optionId: QuestionOptionId): boolean {
  return question.correctOptionId === optionId;
}

export function getQuestionById(
  questions: readonly PictureQuestion[],
  questionId: string,
): PictureQuestion | undefined {
  return questions.find((question) => question.id === questionId);
}
