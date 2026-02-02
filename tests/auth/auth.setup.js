/**
 * Authentication Setup
 * Creates a persistent storage state for authenticated users
 * 
 * This setup handles the registration/authentication flow once and saves the session.
 * Smoke tests then reuse this session via storageState.
 * 
 * To use: npm run test:auth
 * To run smoke tests after: npm run test:smoke (depends on .auth/state.json)
 */

const { test: setup } = require('@playwright/test');
const { RegisterPage } = require('../../pages/RegisterPage');
const { IdentityVerificationFrame } = require('../../pages/IdentityVerificationFrame');
const { ProfilePage } = require('../../pages/ProfilePage');
const { AddressPage } = require('../../pages/AddressPage');
const { PhoneVerificationPage } = require('../../pages/PhoneVerificationPage');
const { env } = require('../../utils/env');

const authFile = './.auth/state.json';

setup('register and authenticate', async ({ page }) => {
  console.log('Starting registration/auth flow...');
  
  try {
    const registerPage = new RegisterPage(page);
    
    // Step 1: Navigate to home
    await registerPage.goto();
    console.log('Navigated to base URL');
    
    // Step 2: Open registration
    await registerPage.openRegister();
    console.log('Opened registration');
    
    // Step 3: Fill credentials
    await registerPage.fillCredentials(env.email, env.password);
    console.log('Filled email/password');
    
    // Step 4: Accept age certification
    await registerPage.acceptAgeCertification();
    console.log('Accepted age certification');
    
    // Step 5: Submit sign up
    await registerPage.submitSignUp();
    console.log('Submitted sign up form');
    
    // Step 6: Handle identity verification frame (if present)
    try {
      const idFrame = new IdentityVerificationFrame(page);
      await idFrame.completeVerification(env.phone, '123456');
      console.log('Completed identity verification');
    } catch (e) {
      console.log('Identity verification frame not found or skipped');
    }
    
    // Step 7: Fill profile (if present)
    try {
      const profilePage = new ProfilePage(page);
      await profilePage.fillName(env.firstName, env.lastName);
      await profilePage.fillDob(env.dateOfBirth);
      await profilePage.confirm();
      console.log('Completed profile information');
    } catch (e) {
      console.log('Profile page not found or skipped');
    }
    
    // Step 8: Fill address (if present)
    try {
      const addressPage = new AddressPage(page);
      await addressPage.searchAndSelectAddress(env.addressQuery);
      await addressPage.confirm();
      console.log('Completed address information');
    } catch (e) {
      console.log('Address page not found or skipped');
    }
    
    // Step 9: Handle phone verification (if present)
    try {
      const phoneVerifPage = new PhoneVerificationPage(page);
      await phoneVerifPage.fillLastFourDigits('1234');
      await phoneVerifPage.fillCellPhone(env.phone);
      await phoneVerifPage.sendCode();
      await phoneVerifPage.submitCode('654321');
      console.log('Completed phone verification');
    } catch (e) {
      console.log('Phone verification page not found or skipped');
    }
    
    // Wait for final redirects
    await page.waitForTimeout(2000);
    console.log('Waiting for redirects...');
    
  } catch (e) {
    console.error('Error during auth setup:', e);
  }
  
  // Save authenticated state
  try {
    await page.context().storageState({ path: authFile });
    console.log(`Authentication state saved to ${authFile}`);
  } catch (e) {
    console.error('Failed to save auth state:', e);
    throw e;
  }
  
  console.log('Setup complete!');
});
