/**
 * RegisterPage POM
 * Handles initial registration form (email/password + age certification)
 * 
 * Methods should be updated with actual Codegen selectors once available.
 */

class RegisterPage {
  constructor(page) {
    this.page = page;
    // PLACEHOLDER SELECTORS - Update with Codegen output
    this.registerLink = page.locator('a, button').filter({ hasText: /register|sign up|create account/i });
    this.emailInput = page.locator('input[type="email"], input[name*="email" i]');
    this.passwordInput = page.locator('input[type="password"]').first();
    this.confirmPasswordInput = page.locator('input[type="password"]').nth(1);
    this.ageCertificationCheckbox = page.locator('input[type="checkbox"]').first();
    this.signUpButton = page.locator('button').filter({ hasText: /register|sign up|submit/i });
  }

  /**
   * Navigate to registration page
   */
  async goto() {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
    // Wait for any React/Vue/Angular content to render
    await this.page.waitForTimeout(2000);
    
    // Try to wait for content to appear
    try {
      await this.page.waitForFunction(
        () => document.body.innerText.length > 50,
        { timeout: 5000 }
      );
    } catch (e) {
      console.warn('Page content not detected after 5s - continuing anyway');
    }
  }

  /**
   * Click on register/sign up link if available
   */
  async openRegister() {
    // Try multiple selector strategies
    const selectors = [
      'a, button',  // Any link or button
    ];
    
    for (const selector of selectors) {
      try {
        const links = this.page.locator(selector).filter({ hasText: /register|sign up|create account/i });
        const count = await links.count().catch(() => 0);
        
        if (count > 0) {
          const firstLink = links.first();
          // Try with shorter timeout
          if (await firstLink.isVisible({ timeout: 2000 }).catch(() => false)) {
            // Use force click to bypass any modal overlays
            await firstLink.click({ force: true });
            await this.page.waitForLoadState('domcontentloaded');
            return;
          }
        }
      } catch (e) {
        // Continue to next strategy
      }
    }
    
    // If we got here, the link might already be on the registration page
    console.log('No register link found - may already be on registration page');
  }

  /**
   * Fill email and password fields
   */
  async fillCredentials(email, password) {
    // Try multiple selector strategies with shorter timeouts
    const emailSelectors = [
      'input[type="email"]',
      'input[name*="email" i]',
      'input[placeholder*="email" i]',
      'input[id*="email" i]',
      'input[data-testid*="email" i]',
    ];
    
    let emailFilled = false;
    for (const selector of emailSelectors) {
      try {
        const locator = this.page.locator(selector).first();
        if (await locator.isVisible({ timeout: 1000 }).catch(() => false)) {
          await locator.fill(email);
          emailFilled = true;
          break;
        }
      } catch (e) {
        // Try next selector
      }
    }
    
    if (!emailFilled) {
      console.warn('Could not find email input with any selector');
      throw new Error('Email input not found');
    }
    
    // Try password selectors
    const passwordSelectors = [
      'input[type="password"]',
      'input[name*="password" i]',
      'input[placeholder*="password" i]',
      'input[id*="password" i]',
    ];
    
    let passwordFilled = false;
    for (const selector of passwordSelectors) {
      try {
        const locator = this.page.locator(selector).first();
        if (await locator.isVisible({ timeout: 1000 }).catch(() => false)) {
          await locator.fill(password);
          passwordFilled = true;
          break;
        }
      } catch (e) {
        // Try next selector
      }
    }
    
    if (!passwordFilled) {
      console.warn('Could not find password input with any selector');
      throw new Error('Password input not found');
    }
    
    // Fill confirm password if present (second password field)
    try {
      const confirmPassword = this.page.locator('input[type="password"]').nth(1);
      if (await confirmPassword.isVisible({ timeout: 1000 }).catch(() => false)) {
        await confirmPassword.fill(password);
      }
    } catch (e) {
      // No confirm password field - that's ok
    }
  }

  /**
   * Accept age certification checkbox
   */
  async acceptAgeCertification() {
    // Try multiple selector strategies
    const checkboxSelectors = [
      'input[type="checkbox"]',
      'input[name*="age" i]',
      'input[name*="certification" i]',
      'input[id*="age" i]',
      '[role="checkbox"]',
    ];
    
    for (const selector of checkboxSelectors) {
      try {
        const checkbox = this.page.locator(selector).first();
        if (await checkbox.isVisible({ timeout: 1000 }).catch(() => false)) {
          const isChecked = await checkbox.isChecked();
          if (!isChecked) {
            await checkbox.check();
            return;
          }
        }
      } catch (e) {
        // Try next selector
      }
    }
    
    console.log('No age certification checkbox found');
  }

  /**
   * Submit sign up form
   */
  async submitSignUp() {
    // Try multiple selector strategies for submit button
    const buttonSelectors = [
      'button:has-text("Register")',
      'button:has-text("Sign Up")',
      'button:has-text("Create Account")',
      'button[type="submit"]',
      'button[name*="submit" i]',
    ];
    
    let submitted = false;
    for (const selector of buttonSelectors) {
      try {
        const button = this.page.locator(selector).first();
        if (await button.isVisible({ timeout: 1000 }).catch(() => false)) {
          await button.click();
          submitted = true;
          break;
        }
      } catch (e) {
        // Try next selector
      }
    }
    
    if (!submitted) {
      // Fallback: find any button with registration-related text
      try {
        const anyButton = this.page.locator('button').filter({ hasText: /register|sign up|submit|create/i }).first();
        if (await anyButton.isVisible({ timeout: 1000 }).catch(() => false)) {
          await anyButton.click();
          submitted = true;
        }
      } catch (e) {
        console.warn('Could not find submit button');
      }
    }
    
    if (submitted) {
      await this.page.waitForLoadState('domcontentloaded').catch(() => {});
    }
  }
}

module.exports = { RegisterPage };
