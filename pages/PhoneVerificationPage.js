/**
 * PhoneVerificationPage POM
 * Handles phone verification with last-four digits, cell phone, and code submission
 * 
 * Selectors should be updated with Codegen output once available.
 */

class PhoneVerificationPage {
  constructor(page) {
    this.page = page;
    // PLACEHOLDER SELECTORS - Update with Codegen output
    this.lastFourDigitsInput = page.locator('input[type="text"][maxlength="4"], input[type="number"][maxlength="4"]');
    this.cellPhoneInput = page.locator('input[type="tel"], input[name*="phone" i], input[name*="mobile" i]');
    this.sendCodeButton = page.locator('button').filter({ hasText: /send|submit|continue/i }).first();
    this.verificationCodeInput = page.locator('input[type="text"][name*="code" i], input[type="text"][name*="otp" i]');
    this.submitCodeButton = page.locator('button').filter({ hasText: /confirm|verify|submit/i }).first();
    this.resendCodeButton = page.locator('button').filter({ hasText: /resend|re-send/i });
  }

  /**
   * Fill last four digits field (e.g., last 4 of SSN or ID)
   */
  async fillLastFourDigits(digits) {
    if (await this.lastFourDigitsInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.lastFourDigitsInput.fill(digits);
    }
  }

  /**
   * Fill cell phone number
   */
  async fillCellPhone(phone) {
    if (await this.cellPhoneInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.cellPhoneInput.fill(phone);
    }
  }

  /**
   * Send verification code
   */
  async sendCode() {
    if (await this.sendCodeButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.sendCodeButton.click();
      await this.page.waitForTimeout(1000); // Brief wait for code to be sent
    }
  }

  /**
   * Fill and submit verification code
   */
  async submitCode(code) {
    if (await this.verificationCodeInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.verificationCodeInput.fill(code);
      await this.submitCodeButton.click();
      await this.page.waitForLoadState('networkidle');
    }
  }

  /**
   * Resend verification code
   */
  async resendCode() {
    if (await this.resendCodeButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.resendCodeButton.click();
    }
  }
}

module.exports = { PhoneVerificationPage };
