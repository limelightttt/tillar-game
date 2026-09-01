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

  const language = page.getByRole("combobox", { name: "Язык интерфейса" });
  await language.selectOption("en");
  await expect(page.getByRole("heading", { name: "Choose a game" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "How shall we play?" })).toBeVisible();
  await expectNoHorizontalOverflow(page);

  await page.getByRole("combobox", { name: "Interface language" }).selectOption("uz");
  await expect(page.getByRole("heading", { name: "O‘yinni tanlang" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Qanday o‘ynaymiz?" })).toBeVisible();
  await expectNoHorizontalOverflow(page);
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

test("two-picture result keeps the branded UI flow", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Начать игру", exact: true }).click();
  await page.getByRole("button", { name: "Завершить игру" }).click();
  await page.getByRole("button", { name: "Завершить", exact: true }).click();

  await expect(page.getByLabel("TILLAR Games")).toBeVisible();
  await expect(page.getByText("2 картинки", { exact: true })).toBeVisible();
  await expect(page.getByText("Сессия завершена", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Играть ещё" })).toBeVisible();
  await expect(page.getByRole("button", { name: "На главную" })).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test("word-game result keeps the branded UI flow", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Четыре картинки/ }).click();
  await page.getByRole("button", { name: "Начать игру", exact: true }).click();
  await page.getByRole("button", { name: "Завершить игру" }).click();
  await page.getByRole("button", { name: "Завершить", exact: true }).click();

  await expect(page.getByLabel("TILLAR Games")).toBeVisible();
  await expect(page.getByText("4 картинки / слово", { exact: true })).toBeVisible();
  await expect(page.getByText("Сессия завершена", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Играть ещё" })).toBeVisible();
  await expect(page.getByRole("button", { name: "На главную" })).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test("language selection stays consistent through an active game", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("combobox", { name: "Язык интерфейса" }).selectOption("en");
  await page.getByRole("button", { name: "Start game", exact: true }).click();

  await expect(page.getByText("Question 1", { exact: true })).toBeVisible();
  await expect(page.getByRole("combobox", { name: "Interface language" })).toHaveValue("en");
  await page.getByRole("button", { name: "Finish game" }).click();
  await expect(page.getByRole("heading", { name: "Finish the session?" })).toBeVisible();
  await expectNoHorizontalOverflow(page);
});
