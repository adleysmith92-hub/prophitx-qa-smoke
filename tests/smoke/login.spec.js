/**
 * Logout Smoke Tests
 *
 * Tests basic logout flow and session handling.
 * Uses auth session from auth.setup.js (storageState).
 *
 * Run with: npm run test:smoke
 * Requires: .auth/state.json (run auth.setup.js first)
 */

// Login to site

 import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("https://ss-sandbox.betprophet.co/?currency=cash");
  await page
    .locator(".flex.items-center.justify-center > span:nth-child(2)")
    .first()
    .click();
  await page.locator(".flex.justify-between.items-center.pb-6").click();
  await page
    .locator(".flex.items-center.justify-center > span:nth-child(3)")
    .click();
  await page
    .locator(".flex.items-center.justify-center > span:nth-child(4)")
    .click();
  await page.locator("span:nth-child(5)").click();
  await page.getByText("Register").click();
  await page.getByRole("button").first().click();
  await page.getByRole("button", { name: "Sign In" }).click();
  await page.getByRole("textbox", { name: "Email" }).click();
  await page
    .getByRole("textbox", { name: "Email" })
    .fill("o.s.aonestepaway@gmail.com");
  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill("Adley5292!");
  await page.getByRole("button", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Enter Code" }).click();
  await page.getByRole("textbox", { name: "Enter Code" }).fill("930984");
  await page.getByRole("button", { name: "Proceed" }).click();
  });



// Login and Logout Smoke Tests

// import { test, expect } from "@playwright/test";

// test("test", async ({ page }) => {
//   await page.goto("https://ss-sandbox.betprophet.co/?currency=cash");
//   await page
//     .locator(".flex.items-center.justify-center > span:nth-child(2)")
//     .first()
//     .click();
//   await page.locator(".flex.justify-between.items-center.pb-6 > .flex").click();
//   await page.locator(".flex.justify-between.items-center.pb-6").click();
//   await page
//     .locator(".flex.items-center.justify-center > span:nth-child(4)")
//     .click();
//   await page.locator("span:nth-child(5)").click();
//   await page.getByText("Register").click();
//   await page.getByRole("button").first().click();
//   await page.getByRole("button", { name: "Sign In" }).click();
//   await page.getByRole("textbox", { name: "Email" }).click();
//   await page
//     .getByRole("textbox", { name: "Email" })
//     .fill("o.s.aonestepaway@gmail.com");
//   await page.getByText("Password", { exact: true }).click();
//   await page.getByRole("textbox", { name: "Password" }).fill("Adley5292!");
//   await page.getByRole("button", { name: "Login" }).click();
//   await page.getByRole("textbox", { name: "Enter Code" }).click();
//   await page.getByRole("textbox", { name: "Enter Code" }).fill("706995");
//   await page.getByRole("button", { name: "Proceed" }).click();
//   await page.locator("#gc-uxhint-close").click();
//   await page.locator(".head > .icon-times").click();
//   await page.getByText("I'll do it later").click();
//   await page.locator(".block").first().click();
//   await page.getByText("Logout").click();
//   await page.locator(".head > .icon-times").click();
// });


// Login and registration setup for smoke tests

// const { test, expect } = require("@playwright/test");

// test.describe("Logout - Smoke", () => {
//   test.use({ storageState: "./.auth/state.json" });

//   test("should navigate to home and stay on valid page", async ({ page }) => {
//     await page.goto("/");
//     await page.waitForLoadState("networkidle");

//     // Verify we're on a valid page
//     expect(page.url()).not.toContain("error");

//     // Verify page loaded
//     const body = page.locator("body");
//     await expect(body).toBeVisible();
//   });

//   test("should have session state present", async ({ page }) => {
//     await page.goto("/");

//     // Check for session/cookies
//     const cookies = await page.context().cookies();

//     // We have a session state (either via cookies or local auth)
//     const pageContent = await page.content();
//     expect(pageContent.length).toBeGreaterThan(0);
//   });

//   test("should preserve authentication across page load", async ({ page }) => {
//     // Load home
//     await page.goto("/");
//     const firstUrl = page.url();

//     // Verify not redirected to login
//     expect(firstUrl).not.toContain("login");
//     expect(firstUrl).not.toContain("signin");
//   });

//   test("should display content after auth reload", async ({ page }) => {
//     await page.goto("/");
//     await page.waitForLoadState("networkidle");

//     // Verify page has meaningful content
//     const title = await page.title();
//     const body = await page.innerText("body");

//     expect(title.length > 0 || body.length > 100).toBeTruthy();
//   });

//   test("should handle page refresh with session intact", async ({ page }) => {
//     await page.goto("/");
//     const urlBefore = page.url();

//     // Refresh page
//     await page.reload();
//     const urlAfter = page.url();

//     // Should stay on same logical page
//     expect(urlAfter).not.toContain("error");
//   });
// });
