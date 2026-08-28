import { createElement } from "react";

import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { AppRouter } from "@/app/router/AppRouter";
import { GameScoreboard } from "@/widgets/game-scoreboard";
import { QuestionBoard } from "@/widgets/question-board";
import { createEmptyAnswerStats } from "@/entities/game-session";
import { pictureQuestions } from "@/entities/question";

function renderRoute(path: string) {
  return renderToStaticMarkup(
    createElement(MemoryRouter, { initialEntries: [path] }, createElement(AppRouter)),
  );
}

describe("two-pictures application", () => {
  it("renders the game setup on the home route", () => {
    expect(renderRoute("/")).toContain("Как играем?");
  });

  it("renders an active question board", () => {
    const markup = renderToStaticMarkup(
      createElement(QuestionBoard, {
        botAnswer: null,
        elapsedResponseTimeMs: 1_500,
        mode: "solo",
        onAnswer: () => undefined,
        playerAnswer: null,
        question: pictureQuestions[0],
        status: "playing",
      }),
    );

    expect(markup).toContain("Выбери одну картинку");
    expect(markup).toContain(pictureQuestions[0].prompt);
  });

  it("renders the solo scoreboard", () => {
    const markup = renderToStaticMarkup(
      createElement(GameScoreboard, {
        botLives: 3,
        botStats: createEmptyAnswerStats(),
        currentRound: 4,
        mode: "solo",
        playerLives: 3,
        playerStats: { ...createEmptyAnswerStats(), answered: 3, correct: 2, errors: 1 },
      }),
    );

    expect(markup).toContain("Верно");
  });
});
