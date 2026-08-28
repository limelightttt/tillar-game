import { describe, expect, it } from "vitest";

import { type PictureQuestion, pictureQuestions } from "@/entities/question";

import { BOT_RESPONSE_RANGE_MS, DUEL_ROUND_COUNT } from "./constants";
import { createGameSessionStore } from "./store";

type TestStore = ReturnType<typeof createGameSessionStore>;

function currentQuestion(store: TestStore): PictureQuestion {
  const question = store.getState().currentQuestion;

  if (!question) {
    throw new Error("Expected an active question");
  }

  return question;
}

function wrongOption(question: PictureQuestion) {
  const option = question.options.find((candidate) => candidate.id !== question.correctOptionId);

  if (!option) {
    throw new Error("Fixture must contain a wrong option");
  }

  return option.id;
}

describe("solo session", () => {
  it("does not repeat a question until the selected pool is exhausted", () => {
    const store = createGameSessionStore({ random: () => 0 });
    const seen = new Set<string>();
    let now = 0;

    expect(store.getState().startSession({ mode: "solo", categoryId: "all" }, now)).toBe(true);

    for (const _questionFixture of pictureQuestions) {
      const question = currentQuestion(store);
      seen.add(question.id);
      now += 100;
      expect(store.getState().answerCurrentQuestion(question.correctOptionId, now)).toBe(true);
      now += 1;
      expect(store.getState().advance(now)).toBe(true);
    }

    expect(seen.size).toBe(pictureQuestions.length);
    expect(seen.has(currentQuestion(store).id)).toBe(true);
  });

  it("shows educational feedback, measures time, and ends only manually", () => {
    const store = createGameSessionStore({ random: () => 0 });
    store.getState().startSession({ mode: "solo", categoryId: "all" }, 1_000);
    store.getState().tick(121_000);

    expect(store.getState().elapsedResponseTimeMs).toBe(120_000);

    const first = currentQuestion(store);
    store.getState().answerCurrentQuestion(wrongOption(first), 121_000);

    expect(store.getState().status).toBe("feedback");
    expect(store.getState().feedback).toEqual({
      kind: "incorrect",
      text: first.incorrectExplanation.text,
    });
    expect(store.getState().playerStats.errors).toBe(1);
    expect(store.getState().playerLives).toBe(3);

    expect(store.getState().finishSolo(122_000)).toBe(true);
    expect(store.getState().status).toBe("finished");
    expect(store.getState().finishReason).toBe("manual");
  });
});

describe("demo duel", () => {
  it("waits for both answers, removes a life on error, and has no feedback popup", () => {
    const store = createGameSessionStore({ random: () => 0 });
    store.getState().startSession({ mode: "duel-demo", categoryId: "all" }, 0);
    const question = currentQuestion(store);

    store.getState().answerCurrentQuestion(wrongOption(question), 500);

    expect(store.getState().status).toBe("playing");
    expect(store.getState().playerLives).toBe(2);
    expect(store.getState().feedback).toBeNull();
    expect(store.getState().advance(600)).toBe(false);

    store.getState().tick(BOT_RESPONSE_RANGE_MS.min);

    expect(store.getState().status).toBe("round-result");
    expect(store.getState().botAnswer).toEqual({
      isCorrect: true,
      responseTimeMs: BOT_RESPONSE_RANGE_MS.min,
    });
    expect(store.getState().advance(BOT_RESPONSE_RANGE_MS.min + 1)).toBe(true);
    expect(store.getState().currentRound).toBe(2);
  });

  it("eliminates the player immediately on the third error", () => {
    const store = createGameSessionStore({ random: () => 0 });
    let roundStartedAt = 0;
    store.getState().startSession({ mode: "duel-demo", categoryId: "all" }, roundStartedAt);

    for (let round = 1; round <= 3; round += 1) {
      const question = currentQuestion(store);
      store.getState().answerCurrentQuestion(wrongOption(question), roundStartedAt + 100);

      if (round < 3) {
        store.getState().tick(roundStartedAt + BOT_RESPONSE_RANGE_MS.min);
        roundStartedAt += BOT_RESPONSE_RANGE_MS.min + 10;
        store.getState().advance(roundStartedAt);
      }
    }

    expect(store.getState().status).toBe("finished");
    expect(store.getState().playerLives).toBe(0);
    expect(store.getState().botLives).toBe(3);
    expect(store.getState().duelResult).toEqual({
      winner: "bot",
      roundsPlayed: 3,
      reason: "out-of-lives",
    });
    expect(store.getState().botAnswer).toBeNull();
  });

  it("eliminates the bot immediately when its third wrong answer is due", () => {
    const store = createGameSessionStore({ random: () => 1 });
    let roundStartedAt = 0;
    store.getState().startSession({ mode: "duel-demo", categoryId: "all" }, roundStartedAt);

    for (let round = 1; round <= 2; round += 1) {
      const question = currentQuestion(store);
      store.getState().answerCurrentQuestion(wrongOption(question), roundStartedAt + 100);
      store.getState().tick(roundStartedAt + BOT_RESPONSE_RANGE_MS.max);
      roundStartedAt += BOT_RESPONSE_RANGE_MS.max + 10;
      store.getState().advance(roundStartedAt);
    }

    store.getState().tick(roundStartedAt + BOT_RESPONSE_RANGE_MS.max);

    expect(store.getState().status).toBe("finished");
    expect(store.getState().botLives).toBe(0);
    expect(store.getState().playerLives).toBe(1);
    expect(store.getState().duelResult?.winner).toBe("player");
    expect(store.getState().playerAnswer).toBeNull();
  });

  it("falls back to score and time when both lose their last life together", () => {
    const store = createGameSessionStore({ random: () => 1 });
    let roundStartedAt = 0;
    store.getState().startSession({ mode: "duel-demo", categoryId: "all" }, roundStartedAt);

    for (let round = 1; round <= 3; round += 1) {
      const question = currentQuestion(store);
      store
        .getState()
        .answerCurrentQuestion(wrongOption(question), roundStartedAt + BOT_RESPONSE_RANGE_MS.max);

      if (round < 3) {
        roundStartedAt += BOT_RESPONSE_RANGE_MS.max + 10;
        store.getState().advance(roundStartedAt);
      }
    }

    expect(store.getState().playerLives).toBe(0);
    expect(store.getState().botLives).toBe(0);
    expect(store.getState().duelResult?.winner).toBe("draw");
  });

  it("finishes the surviving match after exactly eight rounds", () => {
    const store = createGameSessionStore({ random: () => 0 });
    let roundStartedAt = 0;
    store.getState().startSession({ mode: "duel-demo", categoryId: "all" }, roundStartedAt);

    for (let round = 1; round <= DUEL_ROUND_COUNT; round += 1) {
      const question = currentQuestion(store);
      store
        .getState()
        .answerCurrentQuestion(
          question.correctOptionId,
          roundStartedAt + BOT_RESPONSE_RANGE_MS.min,
        );

      if (round < DUEL_ROUND_COUNT) {
        expect(store.getState().status).toBe("round-result");
        roundStartedAt += BOT_RESPONSE_RANGE_MS.min + 10;
        expect(store.getState().advance(roundStartedAt)).toBe(true);
      }
    }

    expect(store.getState().status).toBe("finished");
    expect(store.getState().currentRound).toBe(DUEL_ROUND_COUNT);
    expect(store.getState().finishReason).toBe("rounds-completed");
    expect(store.getState().duelResult?.winner).toBe("draw");
  });
});
