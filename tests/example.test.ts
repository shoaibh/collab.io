import { test, expect } from "@playwright/test";

test.describe("Login functionality", () => {
  test("Successful login", async ({ page }) => {
    await page.goto("https://ray.run/");
    // Perform login actions and assertions
  });

  test("Failed login", async ({ page }) => {
    await page.goto("https://ray.run/");
    // Perform failed login actions and assertions
  });
});
