import { expect, type Page, test } from "@playwright/test";

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
}

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
});

test("home keeps the TILLAR draft responsive", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Выбери игру" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Как играем?" })).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await expect(page).toHaveScreenshot("home-tillar-draft.png", { fullPage: true });
});

test("two-picture solo flow reaches educational feedback", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Начать игру", exact: true }).click();

  const choices = page.getByRole("group", { name: "Варианты ответа" });
  await expect(choices).toBeVisible();
  await choices.getByRole("button").first().click();

  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("button", { name: /Продолжить/ })).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test("word-game selection starts the existing word flow", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Четыре картинки.*слово/i }).click();
  await page.getByRole("button", { name: "Начать игру", exact: true }).click();

  await expect(page.getByRole("group", { name: "Четыре визуальные подсказки" })).toBeVisible();
  await expect(page.getByRole("group", { name: "Составление слова" })).toBeVisible();
  await expectNoHorizontalOverflow(page);
});
