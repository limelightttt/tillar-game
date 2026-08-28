import { describe, expect, it } from "vitest";

import { questionCategories } from "./categories";
import { pictureQuestions } from "./questions";

describe("picture question fixtures", () => {
  it("contains a varied demo pool", () => {
    const contentCategoryIds = questionCategories
      .filter((category) => category.id !== "all")
      .map((category) => category.id);
    const populatedCategoryIds = new Set(pictureQuestions.map((question) => question.categoryId));

    expect(pictureQuestions.length).toBeGreaterThanOrEqual(10);
    expect(populatedCategoryIds).toEqual(new Set(contentCategoryIds));
  });

  it("uses unique question IDs and exactly two options", () => {
    const questionIds = pictureQuestions.map((question) => question.id);

    expect(new Set(questionIds).size).toBe(questionIds.length);
    pictureQuestions.forEach((question) => {
      expect(question.options).toHaveLength(2);
      expect(new Set(question.options.map((option) => option.id)).size).toBe(2);
    });
  });

  it("links the correct fact and wrong-option explanation to valid options", () => {
    pictureQuestions.forEach((question) => {
      const optionIds = question.options.map((option) => option.id);

      expect(optionIds).toContain(question.correctOptionId);
      expect(optionIds).toContain(question.incorrectExplanation.optionId);
      expect(question.incorrectExplanation.optionId).not.toBe(question.correctOptionId);
      expect(question.correctFact.length).toBeGreaterThan(20);
      expect(question.incorrectExplanation.text.length).toBeGreaterThan(20);
    });
  });
});
