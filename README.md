# ProphieX QA Smoke Test Suite

Playwright + JavaScript + Page Object Model (POM) smoke test suite for the ProphetX sandbox environment.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Create .env file and fill in credentials
cp .env.example .env
# Edit .env with your test account details

# 3. Run authentication setup (one-time)
npm run test:auth

# 4. Run smoke tests
npm run test:smoke
```

## Prerequisites

- Node.js 18+
- npm or yarn

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your test credentials and user data in `.env`:
   ```
   PX_EMAIL=your-test-email@example.com
   PX_PASSWORD=your-test-password
   PX_FIRST_NAME=Test
   PX_LAST_NAME=User
   PX_DOB=1990-01-15
   PX_PHONE=+1(555)123-4567
   PX_ADDRESS_QUERY=New York United States
   ```

### 3. Run Authentication Setup

Before running smoke tests, you need to create an authenticated session:

```bash
npm run test:auth
```

This creates `./.auth/state.json` which is reused by smoke tests. Run this once, or again if you want to reset the session.

## Running Tests

### Run all smoke tests
```bash
npm run test:smoke
```

### Run all tests (auth + smoke)
```bash
npm test
```

### Run tests in headed mode (see browser)
```bash
npm run test:headed
```

### Run tests in debug mode
```bash
npm run test:debug
```

### Run tests for specific browser
```bash
npm run test:chrome      # Chromium
npm run test:firefox     # Firefox
npm run test:webkit      # WebKit/Safari
```

### Run registration tests only (optional)
```bash
npx playwright test tests/auth/register.spec.js
```

### Notes about included tests ⚠️
- `tests/auth/auth.setup.js` creates `./.auth/state.json`. Run `npm run test:auth` before smoke tests that depend on it.
- `tests/smoke/placeWager.spec.js` contains two parts:
  - **Generic smoke checks** that verify the authenticated site loads and basic UI elements (these use `test.use({ storageState: './.auth/state.json' })`).
  - **A recorded Codegen flow** (later in the file) that uses the sandbox base URL `https://ss-sandbox.betprophet.co/?currency=cash` and includes hard-coded credentials and exact selectors. This block was likely generated with Playwright Codegen and may require manual cleanup.
- Action items / recommendations:
  - Replace **hard-coded credentials** with environment variables (`PX_EMAIL`, `PX_PASSWORD`) or use the `auth.setup.js` created session for authenticated flows.
  - Convert any `import` statements in recorded blocks to `require` if you use CommonJS in this project, or switch the project to ESM if preferred.
  - Consider splitting the recorded Codegen flow into its own test file (e.g., `tests/smoke/placeWager.recorded.js`) and guarding it with environment checks or a feature toggle.
- To run only the recorded flow inside `placeWager.spec.js` (the test named "test"), use a grep-run:
```bash
npx playwright test tests/smoke/placeWager.spec.js -g "test"
```

## Project Structure

```
pages/
├── RegisterPage.js              # Registration form (email/password)
├── IdentityVerificationFrame.js # ID verification iframe
├── ProfilePage.js               # User profile (name, DOB)
├── AddressPage.js               # Address search & selection
├── PhoneVerificationPage.js     # Phone verification
└── HeaderNav.js                 # Shared navigation

tests/
├── auth/
│   ├── auth.setup.js            # Authentication setup (creates .auth/state.json)
│   └── register.spec.js         # Registration flow tests (optional)
└── smoke/
    ├── placeWager.spec.js       # Wager placement smoke tests
    └── logout.spec.js           # Session/logout smoke tests

config/
└── testData.js                  # Non-sensitive test data (stakes, amounts)

utils/
└── env.js                       # Environment variable loader with validation

.env.example                     # Environment variables template
.env                             # (Created locally) Your credentials
.auth/state.json                 # (Auto-generated) Session state
```

## Architecture & Design Decisions

### Page Object Model (POM)

Each page or major UI component gets its own POM class:

**Why POM?**
- **Maintainability**: Locators centralized in one place. When the UI changes, update only the POM, not every test.
- **Reusability**: Test code reads like business flows. Methods like `registerPage.fillCredentials()` are self-documenting.
- **Scalability**: New pages → new POM files. New tests → reuse existing POMs. No duplication of selectors.

Example:
```javascript
// Without POM (brittle, repetitive)
await page.locator('input[name="email"]').fill('test@example.com');
await page.locator('input[name="password"]').fill('pass');

// With POM (clean, maintainable)
const registerPage = new RegisterPage(page);
await registerPage.fillCredentials('test@example.com', 'pass');
```

### Storage State for Authentication

The suite uses Playwright's `storageState`:

**Why storageState?**
- **Speed**: Auth setup runs once (2-3 min). Smoke tests reuse session instantly (seconds).
- **Isolation**: Each test browser context gets its own session. No shared state pollution.
- **Determinism**: Every smoke test starts with the same authenticated session. No flaky login steps.
- **Idempotency**: Tests are safe to rerun. No side effects from previous runs.

Flow:
1. `auth.setup.js` runs first (registered in `playwright.config.js` as the setup project)
2. Completes registration, saves session to `.auth/state.json`
3. Smoke tests load `.auth/state.json` via `test.use({ storageState: './.auth/state.json' })`
4. Each test starts authenticated, can focus on business flows

### Minimal, Meaningful Assertions

Smoke tests avoid:
- Exact numeric assertions (odds, balances change)
- UI internals (CSS classes, exact HTML structure)
- Tests that depend on external state (real-time data, market hours)

Instead, smoke tests verify:
- **Happy path completion**: User can navigate, load pages, submit forms
- **State preservation**: Session remains intact across reloads
- **Stability indicators**: Page loads, no 500 errors, title/content present

### Parallel Execution & Idempotency

- **Parallel-safe**: Tests use session state (read-only), not a shared mutable account
- **Idempotent**: Run tests 10 times in a row with same result
- **No collisions**: Each test browser context is isolated

If you add tests that *modify* shared state (e.g., place an actual wager that changes account balance), isolate them:
```javascript
test.describe.serial('Wager flow - serial', () => {
  // Only these tests run one-at-a-time
});
```

## Adding New Pages & Tests

### Add a New POM Page

1. Create `pages/MyNewPage.js`:
```javascript
class MyNewPage {
  constructor(page) {
    this.page = page;
    this.myButton = page.locator('button[name="my-button"]');
  }

  async clickMyButton() {
    await this.myButton.click();
  }
}

module.exports = { MyNewPage };
```

2. Import and use in tests:
```javascript
const { MyNewPage } = require('../../pages/MyNewPage');

test('should do something', async ({ page }) => {
  const myPage = new MyNewPage(page);
  await myPage.clickMyButton();
});
```

### Add a New Smoke Test

1. Create `tests/smoke/myFeature.spec.js`:
```javascript
const { test, expect } = require('@playwright/test');
const { MyNewPage } = require('../../pages/MyNewPage');

test.describe('My Feature - Smoke', () => {
  test.use({ storageState: './.auth/state.json' });

  test('should do something', async ({ page }) => {
    await page.goto('/');
    const myPage = new MyNewPage(page);
    // your test logic
  });
});
```

Tests are automatically discovered and run by Playwright.

## Locator Strategy (Codegen Integration)

When converting Codegen recordings to POMs:

1. **Run Codegen** to capture actual selectors:
   ```bash
   npm run codegen
   ```

2. **Prefer stable selectors** (in order):
   - `getByRole('button', { name: /text/ })`
   - `getByLabel(/label/)`
   - `getByTestId('test-id')`
   - `getByText(/text/)`
   - CSS selectors (if above don't work)
   - Avoid: nth-child, fragile paths, classes that change

3. **Update POM** with actual selectors from Codegen output

Example from Codegen:
```
// Codegen output
await page.getByRole('button', { name: /sign up/i }).click();
await page.getByLabel(/email/i).fill('test@example.com');

// Convert to POM
export class RegisterPage {
  readonly signUpButton = page.getByRole('button', { name: /sign up/i });
  readonly emailInput = page.getByLabel(/email/i);
  
  async clickSignUp() { await this.signUpButton.click(); }
  async fillEmail(email) { await this.emailInput.fill(email); }
}
```

## Environment Variables

All sensitive data comes from `.env`:

```
PX_BASE_URL          # Base URL (default: sandbox)
PX_EMAIL             # Test account email
PX_PASSWORD          # Test account password
PX_FIRST_NAME        # User's first name
PX_LAST_NAME         # User's last name
PX_DOB               # User's date of birth (YYYY-MM-DD)
PX_PHONE             # User's phone number
PX_ADDRESS_QUERY     # Address for autocomplete search
```

Non-sensitive defaults live in `config/testData.js` (stake amounts, retry counts, etc.)

## Troubleshooting

### Tests fail with "storageState not found"
Run setup first: `npm run test:auth`

### Selectors don't match
1. Run Codegen: `npm run codegen`
2. Perform the action manually in the opened browser
3. Copy generated selectors to POM classes
4. Re-run tests

### Auth setup fails
- Verify `.env` has valid credentials
- Check that the site is accessible at the base URL
- Run in headed mode to see what's happening: `npx playwright test tests/auth --headed`

### Tests timeout
- Increase timeout in `playwright.config.js` (default: 30s)
- Check network: some waits may be on slow connections
- Use `--debug` mode to step through tests

## CI/CD Integration

For continuous integration:

```bash
# GitHub Actions example
- name: Run Smoke Tests
  run: npm run test:smoke
```

Configure in your CI pipeline:
- Set environment variables (PX_EMAIL, PX_PASSWORD, etc.)
- Run `npm install` first
- Run `npm run test:auth` before `npm run test:smoke`
- Collect `playwright-report/` as artifacts

## Debugging

View test reports:
```bash
# After tests run
npx playwright show-report
```

Debug a specific test:
```bash
npm run test:debug -- tests/smoke/myTest.spec.js
```

View videos/traces:
```bash
# Video recorded automatically on failure
# Trace recorded at test-results/
npx playwright show-trace test-results/trace.zip
```

## Documentation

- [Playwright Docs](https://playwright.dev)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Locator Strategies](https://playwright.dev/docs/locators)
#
