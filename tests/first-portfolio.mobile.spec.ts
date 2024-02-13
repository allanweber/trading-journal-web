/* eslint-disable testing-library/prefer-screen-queries */
import { expect, test } from "@playwright/test";

test.describe("specific viewport for mobile", () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test("Should signin create the first portfolio portfolio", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Trading" }).click();
    await page.getByRole("button", { name: "Sign In" }).click();
    await page.getByTestId("auth-email-field").click();
    await page.getByTestId("auth-email-field").fill("testtradefast@gmail.com");
    await page.getByTestId("auth-submit-button").click();
    await page.getByLabel("Password", { exact: true }).click();
    await page.getByLabel("Password", { exact: true }).fill("k4hJNACfoO8bUSu6");
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

    await page.getByLabel("Select a portfolio").click();
    await page.getByRole("option", { name: "Create a Portfolio" }).click();
    await page.getByPlaceholder("Portfolio Name").click();
    await page.getByPlaceholder("Portfolio Name").fill("Portfolio Test");
    await page.getByPlaceholder("Portfolio Name").press("Tab");
    await page.getByPlaceholder("Portfolio Description").fill("Portfolio Test Description");
    await page.getByPlaceholder("Portfolio Description").press("Tab");
    await page.getByPlaceholder("DD/MM/YYYY").fill("01/12/2023_");
    await page.getByPlaceholder("DD/MM/YYYY").press("Tab");
    await page.getByPlaceholder("0,00").fill("$ 1.500,50");
    await page.getByLabel("Portfolio Currency").click();
    await page.getByLabel("$ - Dollar").getByText("$ - Dollar").click();
    await page.getByRole("button", { name: "Save" }).click();

    await page.route("*/**/api/v1/portfolios", async (route) => {
      const json = [
        {
          id: "1",
          name: "Portfolio Test",
          description: "Portfolio Test Description",
          startDate: "2023-12-01",
          startBalance: 1500.5,
          currency: "USD",
          currentBalance: 1500.5,
        },
      ];
      await route.fulfill({ json });
    });

    await page.getByLabel("Notifications (F8)").getByRole("button").click();
    await page.getByLabel("Select a portfolio").click();
    await page.getByRole("option", { name: "All Portfolios" }).click();
    await expect(page.getByRole("main")).toContainText("Portfolio Test");
    await expect(page.getByRole("main")).toContainText("Portfolio Test Description");
    await expect(page.getByRole("main")).toContainText("1 Dec 2023");
    await expect(page.getByRole("main")).toContainText("$ 1.500,50");
    await page
      .locator("div")
      .filter({ hasText: /^Portfolio Test$/ })
      .nth(1)
      .click();

    await page.route("*/**/api/v1/portfolios/1", async (route) => {
      const json = {
        id: "1",
        name: "Portfolio Test",
        description: "Portfolio Test Description",
        startDate: "2023-12-01",
        startBalance: 1500.5,
        currency: "USD",
        currentBalance: 1500.5,
      };
      await route.fulfill({ json });
    });

    await page.getByLabel("delete portfolio").click();
    await page.getByRole("button", { name: "Continue" }).click();

    await page.route("*/**/api/v1/portfolios", async (route) => {
      const json = [];
      await route.fulfill({ json });
    });

    await page.getByLabel("Notifications (F8)").getByRole("button").click();
  });
});
