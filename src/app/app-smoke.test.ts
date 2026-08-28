import { createElement } from "react";

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { AppRouter } from "@/app/router/AppRouter";

describe("application shell", () => {
  it("renders the TILLAR Games entry screen", () => {
    const markup = renderToStaticMarkup(createElement(AppRouter));

    expect(markup).toContain("TILLAR Games");
    expect(markup).toContain("Интеллектуальные игры");
  });
});
