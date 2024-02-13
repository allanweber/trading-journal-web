/* eslint-disable testing-library/prefer-screen-queries */
import { expect, test } from "@playwright/test";
import { config } from "./test-config";

test("Should signin create the first portfolio portfolio", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Trading" }).click();
  await page.getByRole("button", { name: "Sign In" }).click();
  await page
    .locator("div")
    .filter({ hasText: /^Email$/ })
    .nth(2)
    .click();
  await page.getByTestId("auth-email-field").click();
  await page.getByTestId("auth-email-field").fill("testtradefast@gmail.com");
  await page.getByTestId("auth-submit-button").click();
  await page.getByLabel("Password", { exact: true }).click();
  await page.getByLabel("Password", { exact: true }).fill(config.userPassword);
  await page.getByRole("button", { name: "Continue" }).click();

  await page.route("*/**/api/v1/users/me", async (route) => {
    await route.fulfill();
  });

  await page.route("*/**/api/v1/portfolios", async (route) => {
    const json = [];
    await route.fulfill({ json });
  });

  await page.route("*/**/api/v1/portfolios", async (route) => {
    const json = [];
    await route.fulfill({ json });
  });

  await expect(page.getByLabel("Select a portfolio")).toBeVisible();
  await page.getByLabel("Select a portfolio").click();
  await page.getByRole("option", { name: "Create a Portfolio" }).click();
  await page.getByPlaceholder("Portfolio Name").click();
  await page.getByPlaceholder("Portfolio Name").fill("Test Portfolio");
  await page.getByPlaceholder("Portfolio Description").click();
  await page.getByPlaceholder("Portfolio Description").click();
  await page.getByPlaceholder("Portfolio Description").fill("Portfolio for playwright test");
  await page.getByPlaceholder("DD/MM/YYYY").click();
  await page.getByPlaceholder("DD/MM/YYYY").fill("01/01/2023_");
  await page.getByPlaceholder("0,00").click();
  await page.getByPlaceholder("0,00").fill("$ 1000");
  await page.getByLabel("Portfolio Currency").click();
  await page.getByLabel("€ - Euro").click();
  await page.getByRole("button", { name: "Save" }).click();

  await page.route("*/**/api/v1/portfolios", async (route) => {
    const json = [
      {
        id: "1",
        name: "Test Portfolio",
        description: "Portfolio for playwright test",
        startDate: "2023-01-01",
        startBalance: 1000,
        currency: "EUR",
      },
    ];
    await route.fulfill({ json });
  });

  await page.getByLabel("Select a portfolio").click();
  await page.getByRole("option", { name: "All Portfolios" }).click();
  await expect(page.locator("tbody")).toContainText("Test Portfolio");
});
