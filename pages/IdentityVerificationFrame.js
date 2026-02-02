/**
 * IdentityVerificationFrame POM
 * Handles iframe-based identity verification with phone number and OTP entry
 * 
 * Selectors should be updated with Codegen output once available.
 */

class IdentityVerificationFrame {
  constructor(page) {
    this.page = page;
    // PLACEHOLDER - Update frame selector with actual Codegen output
    this.frameLocator = page.frameLocator('iframe');
    
    // PLACEHOLDER - Selectors within the frame
    this.phoneNumberInput = this.frameLocator.locator('input[type="tel"], input[type="text"]').first();
    this.sendCodeButton = this.frameLocator.locator('button').filter({ hasText: /send|submit|next/i }).first();
    this.otpInput = this.frameLocator.locator('input[type="text"], input[type="number"]').nth(1);
    this.confirmButton = this.frameLocator.locator('button').filter({ hasText: /confirm|verify|submit|done/i }).last();
  }

  /**
   * Fill phone number field
   */
  async fillPhone(phone) {
    await this.phoneNumberInput.fill(phone);
  }

  /**
   * Fill OTP/verification code field
   */
  async fillOtp(code) {
    // Wait for OTP input to be visible after sending code
    await this.otpInput.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    await this.otpInput.fill(code);
  }

  /**
   * Send verification code
   */
  async sendCode() {
    await this.sendCodeButton.click();
  }

  /**
   * Confirm/submit verification
   */
  async confirm() {
    await this.confirmButton.click();
  }

  /**
   * Complete full phone verification flow
   */
  async completeVerification(phone, otpCode) {
    await this.fillPhone(phone);
    await this.sendCode();
    await this.fillOtp(otpCode);
    await this.confirm();
  }
}

module.exports = { IdentityVerificationFrame };
