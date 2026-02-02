// Sign in and Registration Tests with Playwright

import { test, expect } from '@playwright/test';

const BASE = 'https://ss-sandbox.betprophet.co/?currency=cash';
const safeFrameLocator = (page) =>
  page.frameLocator('iframe[title="Client SDK Iframe"] iframe[title="Safe frame content"]');

function uniqueEmail() {
  return `o.s.aonestepaway+${Date.now()}@gmail.com`;
}

test.describe.serial('Registration flows', () => {
  const user = { email: '', password: 'Adley5292!' };

  test('register: successful signup with phone verification', async ({ page }) => {
    user.email = uniqueEmail();
    await page.goto(BASE);

    // Reuse site navigation from existing test to open Register UI
    await page.locator('.flex.items-center.justify-center > span:nth-child(2)').first().click();
    await page.locator('.flex.items-center.justify-center > span:nth-child(3)').click();
    await page.locator('.flex.justify-between.items-center.pb-6').click();
    await page.locator('.flex.items-center.justify-center > span:nth-child(4)').click();
    await page.locator('span:nth-child(5)').click();
    await page.getByText('Register').click();

    // Fill form
    await page.getByRole('textbox', { name: 'Email Address' }).fill(user.email);
    await page.getByRole('textbox', { name: 'Password' }).fill(user.password);

    // Consent checkboxes (robust selectors)
    await page.getByText('I certify that I am at least').first().click();
    await page.getByText('I accept the Terms of Use,').first().click();

    // Submit and wait for phone verification iframe
    await Promise.all([
      page.getByRole('button', { name: /Sign Up/i }).click(),
      page.waitForSelector('iframe[title="Client SDK Iframe"]', { state: 'visible', timeout: 10000 }),
    ]);

    const frame = safeFrameLocator(page);
    await expect(frame.getByRole('textbox', { name: /Phone/i })).toBeVisible({ timeout: 10000 });

    // Fill phone and OTP digits (use the same digits from original script)
    await frame.getByRole('textbox', { name: /Phone/i }).fill('+1 (478) 895-0092');
    await frame.getByRole('textbox', { name: /Digit 1 of/i }).fill('3');
    await frame.getByRole('textbox', { name: /Digit 2 of/i }).fill('0');
    await frame.getByRole('textbox', { name: /Digit 3 of/i }).fill('4');
    await frame.getByRole('textbox', { name: /Digit 4 of/i }).fill('2');
    await frame.getByRole('textbox', { name: /Digit 5 of/i }).fill('8');
    await frame.getByRole('textbox', { name: /Digit 6 of/i }).fill('1');

    await frame.getByTestId('confirm-button').click();

    // Wait for verification iframe to disappear and for client-side state to reflect logged-in
    await expect(page.locator('iframe[title="Client SDK Iframe"]')).toBeHidden({ timeout: 15000 });

    // Basic assertion that registration produced client-side state (localStorage should have something)
    const lsCount = await page.evaluate(() => Object.keys(localStorage).length);
    expect(lsCount).toBeGreaterThan(0);

    // And Sign Up UI should no longer be visible
    await expect(page.getByRole('button', { name: /Sign Up/i })).not.toBeVisible();
  });

  test('register: cannot proceed without consents (client-side prevention)', async ({ page }) => {
    await page.goto(BASE);

    await page.getByText('Register').click();
    const email = uniqueEmail();
    await page.getByRole('textbox', { name: 'Email Address' }).fill(email);
    await page.getByRole('textbox', { name: 'Password' }).fill('Weak1');

    // Do NOT check consent checkboxes
    await page.getByRole('button', { name: /Sign Up/i }).click();

    // Expect that phone verification iframe does NOT appear when consents are missing
    await expect(page.locator('iframe[title="Client SDK Iframe"]')).not.toBeVisible({ timeout: 4000 });

    // Preferably a visible validation/error is shown (role=alert) - assert if present
    const alert = page.locator('[role="alert"]');
    if (await alert.count()) {
      await expect(alert.first()).toBeVisible();
    }
  });

  test('register: duplicate email shows server-side error', async ({ page }) => {
    await page.goto(BASE);
    await page.getByText('Register').click();

    // Attempt to register with same email as created previously
    await page.getByRole('textbox', { name: 'Email Address' }).fill(user.email);
    await page.getByRole('textbox', { name: 'Password' }).fill(user.password);
    await page.getByText('I certify that I am at least').first().click();
    await page.getByText('I accept the Terms of Use,').first().click();
    await page.getByRole('button', { name: /Sign Up/i }).click();

    // Wait for server-side error messages (role=alert or any visible text containing 'already' / 'exists')
    const alert = page.locator('[role="alert"]');
    await expect(alert.first()).toBeVisible({ timeout: 8000 }).catch(async () => {
      // Fallback: look for common duplicate-email messages
      const maybeText = page.locator('text=already exists, text=already registered, text=email exists, text=Email already');
      await expect(maybeText.first()).toBeVisible({ timeout: 8000 });
    });
  });
});

// import { test, expect } from '@playwright/test';

// test('test', async ({ page }) => {
//   await page.goto('https://ss-sandbox.betprophet.co/?currency=cash');
//   await page.locator('.flex.items-center.justify-center > span:nth-child(2)').first().click();
//   await page.locator('.flex.items-center.justify-center > span:nth-child(3)').click();
//   await page.locator('.flex.justify-between.items-center.pb-6').click();
//   await page.locator('.flex.items-center.justify-center > span:nth-child(4)').click();
//   await page.locator('span:nth-child(5)').click();
//   await page.getByText('Register').click();
//   await page.getByRole('textbox', { name: 'Email Address' }).click();
  
//   await page.getByRole('textbox', { name: 'Email Address' }).fill('o.s.aonestepaway+1@gmail.com');
//   await page.getByRole('textbox', { name: 'Password' }).click();
//   await page.getByRole('textbox', { name: 'Password' }).fill('Adley5292!');
//   await page.locator('label').filter({ hasText: 'I certify that I am at least' }).click();
//   await page.locator('label').filter({ hasText: 'I accept the Terms of Use,' }).getByRole('img').click();
//   await page.getByRole('button', { name: 'Sign Up' }).click();
//   await page.locator('iframe[title="Client SDK Iframe"]').contentFrame().locator('iframe[title="Safe frame content"]').contentFrame().getByRole('textbox', { name: 'Phone required' }).fill('+1 (478) 895-0092');
//   await page.locator('iframe[title="Client SDK Iframe"]').contentFrame().locator('iframe[title="Safe frame content"]').contentFrame().getByRole('textbox', { name: 'Digit 1 of' }).fill('3');
//   await page.locator('iframe[title="Client SDK Iframe"]').contentFrame().locator('iframe[title="Safe frame content"]').contentFrame().getByRole('textbox', { name: 'Digit 2 of' }).fill('0');
//   await page.locator('iframe[title="Client SDK Iframe"]').contentFrame().locator('iframe[title="Safe frame content"]').contentFrame().getByRole('textbox', { name: 'Digit 3 of' }).fill('4');
//   await page.locator('iframe[title="Client SDK Iframe"]').contentFrame().locator('iframe[title="Safe frame content"]').contentFrame().getByRole('textbox', { name: 'Digit 4 of' }).fill('2');
//   await page.locator('iframe[title="Client SDK Iframe"]').contentFrame().locator('iframe[title="Safe frame content"]').contentFrame().getByRole('textbox', { name: 'Digit 5 of' }).fill('8');
//   await page.locator('iframe[title="Client SDK Iframe"]').contentFrame().locator('iframe[title="Safe frame content"]').contentFrame().getByRole('textbox', { name: 'Digit 6 of' }).fill('1');
//   await page.locator('iframe[title="Client SDK Iframe"]').contentFrame().locator('iframe[title="Safe frame content"]').contentFrame().getByTestId('confirm-button').click();
// });