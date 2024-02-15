/* eslint-disable testing-library/prefer-screen-queries */
import { expect, test } from "@playwright/test";
import { config } from "./test-config";

test("Create portfolio and entries, delete portfolio at the end", async ({ page, browserName }) => {
  const browser = browserName as string;
  const portfolioName = `PORT ${browserName as string}`;
  const dividend = `DIV ${browser}`;
  const stock = `STOCK ${browser}`;

  //Sign in
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

  //Create Portfolio
  await expect(page.getByLabel("Select a portfolio")).toBeVisible();
  await page.getByLabel("Select a portfolio").click();
  await page.getByRole("option", { name: "Create a Portfolio" }).click();
  await page.getByPlaceholder("Portfolio Name").click();
  await page.getByPlaceholder("Portfolio Name").fill(portfolioName);
  await page.getByPlaceholder("Portfolio Description").click();
  await page.getByPlaceholder("Portfolio Description").fill("Portfolio for playwright test");
  await page.getByPlaceholder("DD/MM/YYYY").click();
  await page.getByPlaceholder("DD/MM/YYYY").fill("01/01/2023_");
  await page.getByPlaceholder("0,00").click();
  await page.getByPlaceholder("0,00").fill("$ 1000");
  await page.getByLabel("Portfolio Currency").click();
  await page.getByLabel("€ - Euro").click();
  await page.getByRole("button", { name: "Save" }).click();

  //Select current portfolio
  await page.getByLabel("Select a portfolio").click();
  await page.getByRole("option", { name: portfolioName }).click();
  await expect(page.getByLabel("portfolio balance")).toContainText("€ 1.000,00");

  //Add Balances
  await page.getByLabel("add balance").click();
  await page.getByRole("button", { name: "deposit" }).click();
  await page.getByPlaceholder("0,00").click();
  await page.getByPlaceholder("0,00").fill("€ 100");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByLabel("portfolio balance")).toContainText("€ 1.100,00");
  await page.getByLabel("add balance").click();
  await page.getByRole("button", { name: "withdrawal" }).click();
  await page.getByPlaceholder("0,00").click();
  await page.getByPlaceholder("0,00").fill("€ 200");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByLabel("portfolio balance")).toContainText("€ 900,00");
  await page.getByRole("link", { name: "portfolio balance" }).click();
  await page.getByText("Add Balance").click();
  await page.getByRole("button", { name: "taxes" }).click();
  await page.getByRole("textbox", { name: "0,00" }).click();
  await page.getByRole("textbox", { name: "0,00" }).fill("€ 20");
  await page.getByRole("button", { name: "Save" }).click();
  await page.getByText("Add Balance").click();
  await page.getByRole("button", { name: "fees" }).click();
  await page.getByRole("textbox", { name: "0,00" }).click();
  await page.getByRole("textbox", { name: "0,00" }).fill("€ 10");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByLabel("portfolio balance")).toContainText("€ 870,00");
  await page.getByLabel("entry-1").getByLabel("delete entry").click();
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByLabel("portfolio balance")).toContainText("€ 1.070,00");

  //Add trades
  await page.getByRole("link", { name: "Trades" }).click();
  await expect(page.locator("td")).toContainText("No trades found.");
  await page.getByRole("button", { name: "Add Trade" }).click();
  await page.getByRole("menuitem", { name: "dividend" }).click();
  await page.getByPlaceholder("Dividend Symbol").click();
  await page.getByPlaceholder("Dividend Symbol").fill(dividend);
  await page.getByPlaceholder("Dividend Symbol").press("Tab");
  await page.getByPlaceholder("0,00").click();
  await page.getByPlaceholder("0,00").fill("€ 100");
  await page.getByRole("button", { name: "Save" }).click();
  await page.getByText(`${dividend} (DIVIDEND)`).click();
  await expect(page.getByLabel("result")).toContainText("€ 100,00");
  await expect(page.getByLabel("entry type")).toContainText("DIVIDEND");
  await page.getByLabel("Toggle Edit").click();
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("some notes");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByLabel("entry notes")).toContainText("some notes");

  await page.getByRole("link", { name: "Trades" }).click();
  await page.getByRole("button", { name: "Add Trade" }).click();
  await page.getByRole("menuitem", { name: "stock" }).click();
  await page.getByPlaceholder("Stock symbol").click();
  await page.getByPlaceholder("Stock symbol").fill("STOCK ");
  await page.getByPlaceholder("Stock symbol").fill(stock);
  await page.getByPlaceholder("DD/MM/YYYY HH:mm").click();
  await page.getByPlaceholder("DD/MM/YYYY HH:mm").fill("01/02/2023 15:35_");
  await page.getByLabel("Price").click();
  await page.getByLabel("Price").fill("€ 150");
  await page.getByLabel("Size").click();
  await page.getByLabel("Size").fill("2");
  await page.getByLabel("Take Profit").click();
  await page.getByLabel("Take Profit").fill("€ 200");
  await page.getByLabel("Stop Loss").click();
  await page.getByLabel("Stop Loss").fill("€ 120");
  await page.getByLabel("Costs").click();
  await page.getByLabel("Costs").fill("5");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.locator("h2")).toContainText("Open");

  await page.getByRole("link", { name: "Trades" }).click();
  await expect(page.locator("tbody")).toContainText("1 Feb 2023 03:35");
  await expect(page.locator("tbody")).toContainText(stock);
  await expect(page.locator("tbody")).toContainText("Open");
  await expect(page.locator("tbody")).toContainText("€ 150,00");
  await expect(page.locator("tbody")).toContainText("2,00");
  await expect(page.locator("tbody")).toContainText("N/A");

  await page.getByRole("button", { name: "Open", exact: true }).click();
  await page.getByPlaceholder("DD/MM/YYYY HH:mm").fill("10/02/2024 18:008");
  await page.getByLabel("Exit price").click();
  await page.getByLabel("Exit price").fill("€ 170");
  await page.getByRole("button", { name: "Save" }).click();
  await page.waitForTimeout(1000);

  await expect(page.locator("tbody")).toContainText("Win");
  await expect(page.locator("tbody")).toContainText("€ 35,00");
  await expect(page.locator("tbody")).toContainText("23,33 %");
  await expect(page.getByLabel("portfolio balance")).toContainText("€ 1.205,00");

  //Delete Portfolio
  await page.getByLabel("Select a portfolio").click();
  await page.getByRole("option", { name: "All Portfolios" }).click();
  await page.getByRole("link", { name: portfolioName }).click();
  await page.getByLabel(`delete portfolio ${portfolioName}`).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.waitForTimeout(500);
});
