const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  timeout: 30 * 1000,
  expect: {
    timeout: 5 * 1000,
  },
  use: {
    baseURL: 'https://ss-sandbox.betprophet.co/',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // Setup project to create auth state (only run if needed)
    {
      name: 'setup',
      testMatch: '**/auth.setup.js',
      use: { ...devices['Desktop Chrome'] },
    },

    // Chromium smoke tests
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      // Uncomment next line if auth state file doesn't exist yet
      // dependencies: ['setup'],
    },

    // Firefox smoke tests
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      // dependencies: ['setup'],
    },

    // WebKit smoke tests
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      // dependencies: ['setup'],
    },
  ],

  //   webServer: {
  //     command: 'npm run dev',
  //     url: 'http://localhost:3000',
  //     reuseExistingServer: !process.env.CI,
  //   },
});
