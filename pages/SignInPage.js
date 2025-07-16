/**
 * Sign In Page Object - Handles user authentication functionality
 */

module.exports = {
  // Organized locators by logical sections
  email: '//input[@name="email"]',
  password: '//input[@name="password"]',
  signIn: '//button[@type="submit"]',
  resetPassword: '[data-sentry-component="ResetPassword"] button',
  signUpLink: 'form [data-sentry-element="Link"]',
  mainContent: '#main-content[role="main"]',
  form: 'form[data-testid="signin-form"], form:has(input[name="email"])',
  errorContainer: ".text-destructive",
  successMessage: '[data-testid="success-message"]',
  errorMessage: '[data-testid="error-message"]',
  validationError: ".text-destructive",

  expectedElements: {
    title: "SIGN IN",
    url: "/login",
  },

  // Navigation Methods
  async navigateToPage(country = "us") {
      const url = `/${country}/login`;
      I.amOnPage(url);
      await this.verifyPageLoaded();
  },

  // Form Input Methods
  async fillSignInCredentials(userData) {
      await this.validateUserData(userData);
      await I.waitForElement(this.email);
      await I.waitForElement(this.password);
      I.clearField(this.email);
      I.fillField(this.email, userData.email);
      I.clearField(this.password);
      I.fillField(this.password, userData.password);
  },

  async fillEmail(email) {
      await I.waitForElement(this.email);
      I.clearField(this.email);
      I.fillField(this.email, email);
  },

  async fillPassword(password) {
      await I.waitForElement(this.password);
      I.clearField(this.password);
      I.fillField(this.password, password);
  },

  // Action Methods
  async submitSignIn() {
      await I.waitForElement(this.signIn);
      I.click(this.signIn);
  },

  async performSignIn(userData) {
      await this.fillSignInCredentials(userData);
      await this.submitSignIn();
  },

  // Navigation to Other Pages
  async goToSignUp() {
      await I.waitForElement(this.signUpLink);
      I.click(this.signUpLink);
  },

  async goToResetPassword() {
      await I.waitForElement(this.resetPassword);
      I.click(this.resetPassword);
  },

  // Validation and Verification Methods
  async verifyPageLoaded() {
      I.seeInTitle(this.expectedElements.title);
      await I.waitForElement(this.mainContent);
      I.seeElement(this.form);
  },
};
