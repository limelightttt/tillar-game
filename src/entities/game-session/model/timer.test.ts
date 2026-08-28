import { describe, expect, it } from "vitest";

import { getElapsedResponseTimeMs } from "./timer";

describe("response timer", () => {
  it("measures elapsed time without imposing a deadline", () => {
    expect(getElapsedResponseTimeMs(1_000, 121_000)).toBe(120_000);
    expect(getElapsedResponseTimeMs(1_000, 900)).toBe(0);
  });
});
