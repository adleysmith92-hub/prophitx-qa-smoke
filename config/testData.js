/**
 * Non-sensitive test data (stakes, amounts, etc.)
 * Sensitive data comes from .env files
 */

const testData = {
  // Wager / Betting amounts
  defaultStakeAmount: '10',
  minStakeAmount: '0.50',
  maxStakeAmount: '1000',

  // Test timeouts
  shortTimeout: 5000,
  mediumTimeout: 10000,
  longTimeout: 30000,

  // UI selectors and test IDs
  currencyOptions: {
    cash: 'cash',
    bonus: 'bonus',
    freeBet: 'freeBet',
  },
};

module.exports = { testData };
