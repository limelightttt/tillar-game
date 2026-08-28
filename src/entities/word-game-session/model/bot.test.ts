import { describe, expect, it } from "vitest";

import { createPendingWordBotAnswer } from "./bot";
import { WORD_BOT_RESPONSE_RANGE_MS } from "./constants";

describe("word demo bot", () => {
  it("creates deterministic answers inside the demo timing range", () => {
    expect(createPendingWordBotAnswer(() => 0)).toEqual({
      isCorrect: true,
      responseTimeMs: WORD_BOT_RESPONSE_RANGE_MS.min,
    });
    expect(createPendingWordBotAnswer(() => 1)).toEqual({
      isCorrect: false,
      responseTimeMs: WORD_BOT_RESPONSE_RANGE_MS.max,
    });
  });
});
