import { describe, expect, it } from "vitest";

import { buildWordPuzzleCycle, createWordPuzzleQueue, takeNextWordPuzzle } from "./queue";

describe("word puzzle queue", () => {
  it("deduplicates the pool and yields every puzzle before repeating", () => {
    let queue = createWordPuzzleQueue(["a", "b", "a", "c"], {
      random: () => 0,
    });
    const drawn: string[] = [];

    for (const _id of queue.pool) {
      const result = takeNextWordPuzzle(queue, () => 0);

      if (result.puzzleId) {
        drawn.push(result.puzzleId);
      }
      queue = result.queue;
    }

    expect(new Set(drawn)).toEqual(new Set(["a", "b", "c"]));
    expect(drawn).toHaveLength(3);
  });

  it("does not repeat the last puzzle at a cycle boundary", () => {
    const cycle = buildWordPuzzleCycle(["c", "a", "b"], "c", () => 0.99);

    expect(cycle[0]).not.toBe("c");
    expect(new Set(cycle)).toEqual(new Set(["a", "b", "c"]));
  });

  it("starts a new cycle only after the remaining list is empty", () => {
    let queue = createWordPuzzleQueue(["a"], { random: () => 0 });
    const first = takeNextWordPuzzle(queue, () => 0);
    queue = first.queue;
    const second = takeNextWordPuzzle(queue, () => 0);

    expect(first.puzzleId).toBe("a");
    expect(first.queue.cycle).toBe(0);
    expect(second.puzzleId).toBe("a");
    expect(second.queue.cycle).toBe(1);
  });

  it("returns null for an empty pool", () => {
    const result = takeNextWordPuzzle(createWordPuzzleQueue([]), () => 0);

    expect(result.puzzleId).toBeNull();
  });
});
