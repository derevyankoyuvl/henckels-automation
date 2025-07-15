/**
 * Sign In Page Object - Handles user authentication functionality
 */

module.exports = {
  // Organized locators by logical sections
  fields: {
    email: '//input[@name="email"]',
    password: '//input[@name="password"]',
  },
  buttons: {
    signIn: '//button[@type="submit"]',
    resetPassword: '[data-sentry-component="ResetPassword"] button',
    signUpLink: 'form [data-sentry-element="Link"]',
  },
  containers: {
    mainContent: '#main-content[role="main"]',
    form: 'form[data-testid="signin-form"], form:has(input[name="email"])',
    errorContainer: ".text-destructive",
    loadingSpinner: '[data-testid="loading-spinner"]',
  },
  messages: {
    successMessage: '[data-testid="success-message"]',
    errorMessage: '[data-testid="error-message"]',
    validationError: ".text-destructive",
  },

  expectedElements: {
    title: "SIGN IN",
    url: "/login"
  },

  // Navigation Methods
  async navigateToPage(country = "us") {
    try {
      const url = `/${country}/login`;

      I.amOnPage(url);
      await this.verifyPageLoaded();
    } catch (error) {
      throw new Error(`Failed to navigate to sign in page: ${error.message}`);
    }
  },

  // Form Input Methods
  async fillSignInCredentials(userData) {
    try {
      await this.validateUserData(userData);
      await I.waitForElement(this.fields.email);
      await I.waitForElement(this.fields.password);
      
      I.clearField(this.fields.email);
      I.fillField(this.fields.email, userData.email);
      
      I.clearField(this.fields.password);
      I.fillField(this.fields.password, userData.password);
    } catch (error) {
      throw new Error(`Failed to fill sign in credentials: ${error.message}`);
    }
  },

  async fillEmail(email) {
    try {
      if (!email || !this._isValidEmail(email)) {
        throw new Error('Invalid email provided');
      }
      
      await I.waitForElement(this.fields.email);
      I.clearField(this.fields.email);
      I.fillField(this.fields.email, email);
    } catch (error) {
      throw new Error(`Failed to fill email: ${error.message}`);
    }
  },

  async fillPassword(password) {
    try {
      if (!password || password.length < 1) {
        throw new Error('Password cannot be empty');
      }
      
      await I.waitForElement(this.fields.password);
      I.clearField(this.fields.password);
      I.fillField(this.fields.password, password);
    } catch (error) {
      throw new Error(`Failed to fill password: ${error.message}`);
    }
  },

  // Action Methods
  async submitSignIn() {
    try {
      
      await I.waitForElement(this.buttons.signIn);
      I.click(this.buttons.signIn);
    } catch (error) {
      throw new Error(`Failed to submit sign in form: ${error.message}`);
    }
  },

  async performSignIn(userData) {
    try {
      await this.fillSignInCredentials(userData);
      await this.submitSignIn();
    } catch (error) {
      throw new Error(`Sign in flow failed: ${error.message}`);
    }
  },

  // Navigation to Other Pages
  async goToSignUp() {
    try {
      await I.waitForElement(this.buttons.signUpLink);
      I.click(this.buttons.signUpLink);
    } catch (error) {
      throw new Error(`Failed to navigate to sign up page: ${error.message}`);
    }
  },

  async goToResetPassword() {
    try {
      await I.waitForElement(this.buttons.resetPassword);
      I.click(this.buttons.resetPassword);
    } catch (error) {
      throw new Error(`Failed to navigate to reset password page: ${error.message}`);
    }
  },

  // Validation and Verification Methods
  async verifyPageLoaded() {
    try {
      I.seeInTitle(this.expectedElements.title);
      await I.waitForElement(this.containers.mainContent);
      I.seeElement(this.containers.form);
    } catch (error) {
      throw new Error(`Sign in page not loaded properly: ${error.message}`);
    }
  },

  async hasValidationErrors() {
    try {
      const errorCount = await I.grabNumberOfVisibleElements(this.messages.validationError);
      const hasErrors = errorCount > 0;
      
      if (hasErrors) {
        console.log(`⚠️ Found ${errorCount} validation errors`);
      }
      
      return hasErrors;
    } catch (error) {
      console.error(`Error checking validation errors: ${error.message}`);
      return false;
    }
  },

  async getValidationErrors() {
    try {
      const errorElements = await I.grabTextFromAll(this.messages.validationError);
      return errorElements;
    } catch (error) {
      console.error(`Error getting validation errors: ${error.message}`);
      return [];
    }
  },

  async verifySignInSuccess() {
    try {
      // Check if we're redirected away from login page
      const currentUrl = await I.grabCurrentUrl();
      if (currentUrl.includes('/login')) {
        throw new Error('Still on login page after sign in attempt');
      }
      
      console.log('✅ Sign in successful - redirected from login page');
    } catch (error) {
      throw new Error(`Sign in verification failed: ${error.message}`);
    }
  },

  async verifySignInFailure() {
    try {
      const hasErrors = await this.hasValidationErrors();
      if (!hasErrors) {
        // Check if still on login page
        const currentUrl = await I.grabCurrentUrl();
        if (!currentUrl.includes('/login')) {
          throw new Error('Expected sign in to fail but appears to have succeeded');
        }
      }
      
      console.log('✅ Sign in failure verified');
    } catch (error) {
      throw new Error(`Sign in failure verification failed: ${error.message}`);
    }
  },

  // Utility Methods
  validateUserData(userData) {
    if (!userData) {
      throw new Error('User data is required');
    }
    
    if (!userData.email || !this._isValidEmail(userData.email)) {
      throw new Error('Valid email is required');
    }
    
    if (!userData.password || userData.password.length < 1) {
      throw new Error('Password is required');
    }
  },

  _isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

};
