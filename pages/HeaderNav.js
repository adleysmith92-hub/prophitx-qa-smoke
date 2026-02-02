/**
 * HeaderNav Component
 * Shared navigation bar with account menu, logout, etc.
 */

class HeaderNav {
  constructor(page) {
    this.page = page;
    // Update these selectors based on actual DOM structure from Codegen
    this.accountMenuButton = page.getByRole('button', { name: /account|menu/i });
    this.userMenuDropdown = page.locator('[role="menu"]');
    this.logoutButton = page.getByRole('menuitem', { name: /logout|sign out/i });
  }

  async openAccountMenu() {
    await this.accountMenuButton.click();
    await this.userMenuDropdown.isVisible();
  }

  async logout() {
    await this.openAccountMenu();
    await this.logoutButton.click();
  }
}

module.exports = { HeaderNav };
