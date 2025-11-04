import { test, expect } from "@playwright/test";

const baseUrl = process.env.E2E_BASE_URL ?? "http://localhost:3000";

/**
 * Basic smoke tests that ensure the marketing site renders and the Clerk widgets hydrate without errors.
 * These rely on the development Clerk instance configured under .env.local.
 */
test.describe("Public routes", () => {
  test("home page loads and shows hero content", async ({ page }) => {
    await page.goto(baseUrl);

    await expect(
      page.getByRole("heading", {
        name: "Get ahead of burnout with daily moments of care.",
      }),
    ).toBeVisible();

    await expect(page.getByRole("link", { name: "Start your wellbeing journey" })).toBeVisible();
  });

  test("login page renders Clerk sign-in", async ({ page }) => {
    await page.goto(`${baseUrl}/login`);

    await expect(page.getByRole("heading", { name: "Welcome Back!" })).toBeVisible();

    const signInWidget = page.getByTestId("clerk-sign-in");
    await expect(signInWidget).toBeVisible();
    await expect(signInWidget.getByRole("button", { name: /Continue/i })).toBeVisible();
  });

  test("sign-up page renders Clerk sign-up", async ({ page }) => {
    await page.goto(`${baseUrl}/sign-up`);

    await expect(page.getByRole("heading", { name: "Create an Account" })).toBeVisible();

    const signUpWidget = page.getByTestId("clerk-sign-up");
    await expect(signUpWidget).toBeVisible();
    await expect(signUpWidget.getByRole("button", { name: /Sign up/i })).toBeVisible();
  });
});
