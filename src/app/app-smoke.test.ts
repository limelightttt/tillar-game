import { createElement } from "react";

import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { AppRouter } from "@/app/router/AppRouter";
import { GameScoreboard } from "@/widgets/game-scoreboard";
import { QuestionBoard } from "@/widgets/question-board";
import { WordPuzzleBoard } from "@/widgets/word-puzzle-board";
import { createEmptyAnswerStats } from "@/entities/game-session";
import { pictureQuestions } from "@/entities/question";
import { createLetterTiles, wordPuzzles } from "@/entities/word-puzzle";

function renderRoute(path: string) {
  return renderToStaticMarkup(
    createElement(MemoryRouter, { initialEntries: [path] }, createElement(AppRouter)),
  );
}

describe("application rendering", () => {
  it("renders the game setup on the home route", () => {
    const markup = renderRoute("/");

    expect(markup).toContain("Как играем?");
    expect(markup).toContain("Две картинки");
    expect(markup).toContain("Четыре картинки / слово");
  });

  it("renders the four-pictures word board and letter controls", () => {
    const puzzle = wordPuzzles[0];

    if (!puzzle) throw new Error("Expected at least one word puzzle fixture");

    const markup = renderToStaticMarkup(
      createElement(WordPuzzleBoard, {
        botAnswer: null,
        elapsedResponseTimeMs: 2_400,
        letterTiles: createLetterTiles(puzzle, () => 0.5),
        mode: "solo",
        onClear: () => undefined,
        onRemoveTile: () => undefined,
        onSelectTile: () => undefined,
        onSubmit: () => undefined,
        playerAnswer: null,
        puzzle,
        selectedTileIds: [],
        status: "playing",
      }),
    );

    expect(markup).toContain("Четыре визуальные подсказки");
    expect(markup).toContain("Проверить слово");
    expect(markup).toContain(puzzle.prompt);
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

    expect(markup).toContain(pictureQuestions[0].prompt);
  });

  it("renders the solo scoreboard", () => {
    const stats = {
      ...createEmptyAnswerStats(),
      answered: 3,
      correct: 2,
      errors: 1,
      bestStreak: 2,
      totalResponseTimeMs: 9_000,
      averageResponseTimeMs: 3_000,
    };
    const markup = renderToStaticMarkup(
      createElement(GameScoreboard, {
        botLives: 3,
        botStats: createEmptyAnswerStats(),
        currentRound: 4,
        mode: "solo",
        playerLives: 3,
        playerStats: stats,
      }),
    );

    expect(markup).toContain("Верно");
    expect(markup).toContain("3,0 с");
  });
});
