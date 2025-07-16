const { I } = inject();

/**
 * Sign Up Page Object - Handles user registration functionality
 */

module.exports = {
  // Locators for the registration page elements
  email: '//input[@name="email"]',
  firstName: '//input[@name="firstName"]',
  lastName: '//input[@name="lastName"]',
  password: '//input[@name="password"]',
  signUp: '//button[@type="submit"]',
  acceptTerms: "#registration-accept",
  privacyPolicy: '//a[contains(text(), "Privacy Policy")]',
  termsOfService: '//a[contains(text(), "Terms of Service")]',
  signIn: '//a[contains(text(), "Sign in")]',
  mainContent: "#main-content",
  header: "header.sticky",
  footer: "#reduced-footer",
  form: 'form[data-testid="registration-form"], form:has(input[name="email"])',
  loadingSpinner: '[data-testid="loading-spinner"]',
  alertMsg: '[data-sentry-element="AlertDescription"]',
  successMessage: '[data-testid="success-message"]',
  errorMessage: ".error-message, .text-destructive",
  validationError: ".field-error, .validation-error",
  captchaContainer: '[title="reCAPTCHA"]',
  captchaCheckbox: "#recaptcha-anchor",
  captchaFrame: 'iframe[title="reCAPTCHA"]',

  expectedElements: {
    title: "HENCKELS US",
    url: "/register",
  },

  validation: {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    password: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
    },
    name: {
      minLength: 2,
      maxLength: 50,
    },
  },

  // Navigation Methods
  async navigateToPage(country = "us") {
    const url = `/${country}/register`;
    I.amOnPage(url);
    await this.verifyPageLoaded();
  },

  // Form Input Methods
  async fillRegistrationForm(userData) {
    // Clear and fill all fields
    await this.fillEmail(userData.email);
    await this.fillFirstName(userData.firstName);
    await this.fillLastName(userData.lastName);
    await this.fillPassword(userData.password);
  },

  async fillEmail(email) {
    await I.waitForElement(this.email);
    I.clearField(this.email);
    I.fillField(this.email, email);
  },

  async fillFirstName(firstName) {
    await I.waitForElement(this.firstName);
    I.clearField(this.firstName);
    I.fillField(this.firstName, firstName);
  },

  async fillLastName(lastName) {
    await I.waitForElement(this.lastName);
    I.clearField(this.lastName);
    I.fillField(this.lastName, lastName);
  },

  async fillPassword(password) {
    await I.waitForElement(this.password);
    I.clearField(this.password);
    I.fillField(this.password, password);
  },

  // Action Methods
  async acceptTermsAndConditions() {
    await I.waitForElement(this.acceptTerms);
    I.click(this.acceptTerms);
  },

  async submitForm() {
    await I.waitForElement(this.signUp);
    I.click(this.signUp);
  },

  async acceptCaptcha() {
    await I.waitForElement(this.captchaFrame, this.config.captchaTimeout);

    within({ frame: this.captchaContainer }, () => {
      I.click(this.captchaCheckbox);
    });

    // Wait for CAPTCHA to be processed
    I.wait(2);
  },

  // Navigation to Other Pages
  async goToSignIn() {
    await I.waitForElement(this.signIn);
    I.click(this.signIn);
  },

  async openPrivacyPolicy() {
    await I.waitForElement(this.privacyPolicy);
    I.click(this.privacyPolicy);
  },

  async openTermsOfService() {
    await I.waitForElement(this.termsOfService);
    I.click(this.termsOfService);
  },

  // Validation and Verification Methods
  async verifyPageLoaded() {
    I.seeInTitle(this.expectedElements.title);
    await I.waitForElement(this.mainContent);
    I.seeElement(this.form);
  },

  async validateFormElements() {
    // Check all form fields are present and enabled
    const fields = [this.email, this.firstName, this.lastName, this.password];

    for (const fieldSelector of fields) {
      I.seeElement(fieldSelector);
      I.seeElement(`${fieldSelector}:enabled`);
    }

    // Check buttons are present
    I.seeElement(this.signUp);
    I.seeElement(this.acceptTerms);
  },

  async verifyAlertMsg(expectedMessage) {
      await I.waitForElement(this.alertMsg);
      I.see(expectedMessage, this.alertMsg);
  },
};
