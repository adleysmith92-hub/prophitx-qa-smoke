/**
 * ProfilePage POM
 * Handles user profile information (first name, last name, date of birth)
 * 
 * Selectors should be updated with Codegen output once available.
 */

class ProfilePage {
  constructor(page) {
    this.page = page;
    // PLACEHOLDER SELECTORS - Update with Codegen output
    this.firstNameInput = page.locator('input[type="text"][name*="first" i], input[name*="name" i]').first();
    this.lastNameInput = page.locator('input[type="text"][name*="last" i], input[name*="surname" i]');
    this.dobInput = page.locator('input[type="date"], input[type="text"][name*="dob" i]');
    this.confirmButton = page.locator('button').filter({ hasText: /continue|next|submit|confirm/i }).first();
  }

  /**
   * Fill first and last name
   */
  async fillName(firstName, lastName) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
  }

  /**
   * Fill date of birth (format: YYYY-MM-DD)
   */
  async fillDob(dob) {
    await this.dobInput.fill(dob);
  }

  /**
   * Confirm/submit profile information
   */
  async confirm() {
    await this.confirmButton.click();
    await this.page.waitForLoadState('networkidle');
  }
}

module.exports = { ProfilePage };
