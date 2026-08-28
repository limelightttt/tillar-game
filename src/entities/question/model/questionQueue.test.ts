import { describe, expect, it } from "vitest";

import { buildQuestionCycle, createQuestionQueue, takeNextQuestion } from "./questionQueue";

const alwaysZero = (): number => 0;

describe("question queue", () => {
  it("returns every question exactly once before a new cycle", () => {
    let queue = createQuestionQueue(["a", "b", "c", "d"], { random: alwaysZero });
    const seen: string[] = [];

    for (let index = 0; index < 4; index += 1) {
      const result = takeNextQuestion(queue, alwaysZero);
      expect(result.questionId).not.toBeNull();
      seen.push(result.questionId ?? "");
      queue = result.queue;
    }

    expect(new Set(seen)).toEqual(new Set(["a", "b", "c", "d"]));
    expect(queue.remaining).toEqual([]);
    expect(queue.cycle).toBe(0);
  });

  it("does not put the previous question first in a new cycle", () => {
    const initialQueue = createQuestionQueue(["a", "b", "c"], { random: alwaysZero });
    let queue = initialQueue;

    while (queue.remaining.length > 0) {
      queue = takeNextQuestion(queue, alwaysZero).queue;
    }

    const previousQuestionId = queue.lastQuestionId;
    const next = takeNextQuestion(queue, alwaysZero);

    expect(next.questionId).not.toBe(previousQuestionId);
    expect(next.queue.cycle).toBe(1);
  });

  it("deduplicates an input pool", () => {
    const queue = createQuestionQueue(["a", "a", "b", "b"], { random: alwaysZero });

    expect(queue.pool).toHaveLength(2);
    expect(new Set(queue.pool)).toEqual(new Set(["a", "b"]));
    expect(queue.remaining).toHaveLength(2);
  });

  it("returns an unchanged queue for an empty pool", () => {
    const queue = createQuestionQueue([], { random: alwaysZero });
    const result = takeNextQuestion(queue, alwaysZero);

    expect(result.questionId).toBeNull();
    expect(result.queue).toBe(queue);
  });

  it("handles a one-question pool without dropping the only question", () => {
    let queue = createQuestionQueue(["only"], { random: alwaysZero });
    const first = takeNextQuestion(queue, alwaysZero);
    queue = first.queue;
    const second = takeNextQuestion(queue, alwaysZero);

    expect(first.questionId).toBe("only");
    expect(second.questionId).toBe("only");
    expect(second.queue.cycle).toBe(1);
  });

  it("builds a cycle without mutating the source array", () => {
    const source = ["a", "b", "c"];
    const cycle = buildQuestionCycle(source, null, alwaysZero);

    expect(source).toEqual(["a", "b", "c"]);
    expect(cycle).not.toBe(source);
  });
});
