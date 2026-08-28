import { describe, expect, it } from "vitest";

import { getWordResponseTimeMs } from "./timer";

describe("word response timer", () => {
  it("measures without enforcing a player deadline", () => {
    expect(getWordResponseTimeMs(1_000, 181_000)).toBe(180_000);
    expect(getWordResponseTimeMs(1_000, 900)).toBe(0);
  });
});
