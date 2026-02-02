/**
 * AddressPage POM
 * Handles address search with autocomplete and selection
 * 
 * Selectors should be updated with Codegen output once available.
 */

class AddressPage {
  constructor(page) {
    this.page = page;
    // PLACEHOLDER SELECTORS - Update with Codegen output
    this.searchInput = page.locator('input[type="text"][name*="address" i], input[placeholder*="address" i]');
    this.searchResults = page.locator('[role="listbox"], [role="option"], .dropdown, .suggestions');
    this.confirmButton = page.locator('button').filter({ hasText: /continue|next|submit|confirm/i }).first();
  }

  /**
   * Search for and select an address
   * @param query - Search query (e.g., "New York United States")
   * @param selectionText - Optional text to match in dropdown. If not provided, selects first option.
   */
  async searchAndSelectAddress(query, selectionText) {
    // Clear input and type search query
    await this.searchInput.fill('');
    await this.searchInput.fill(query);
    
    // Wait for autocomplete results
    await this.page.waitForTimeout(500);
    
    // Select address
    if (selectionText) {
      const option = this.page.locator(`text=${selectionText}`).first();
      await option.click();
    } else {
      // Select first available option
      const firstOption = this.searchResults.locator('[role="option"], li').first();
      if (await firstOption.isVisible({ timeout: 3000 }).catch(() => false)) {
        await firstOption.click();
      }
    }
  }

  /**
   * Confirm/submit address selection
   */
  async confirm() {
    await this.confirmButton.click();
    await this.page.waitForLoadState('networkidle');
  }
}

module.exports = { AddressPage };
