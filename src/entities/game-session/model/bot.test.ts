import { describe, expect, it } from "vitest";

import { createPendingBotAnswer } from "./bot";
import { BOT_RESPONSE_RANGE_MS } from "./constants";

describe("demo bot plan", () => {
  it("keeps its response inside the documented demo range", () => {
    const fastest = createPendingBotAnswer(() => 0);
    const slowest = createPendingBotAnswer(() => 1);

    expect(fastest).toEqual({
      isCorrect: true,
      responseTimeMs: BOT_RESPONSE_RANGE_MS.min,
    });
    expect(slowest).toEqual({
      isCorrect: false,
      responseTimeMs: BOT_RESPONSE_RANGE_MS.max,
    });
  });
});
