const { I } = inject();

/**
 * Sign Up Page Object - Handles user registration functionality
 */

module.exports = {
  // Locators for the registration page elements
  fields: {
    email: '//input[@name="email"]',
    firstName: '//input[@name="firstName"]',
    lastName: '//input[@name="lastName"]',
    password: '//input[@name="password"]',
  },
  buttons: {
    signUp: '//button[@type="submit"]',
    acceptTerms: "#registration-accept"
  },
  links: {
    privacyPolicy: '//a[contains(text(), "Privacy Policy")]',
    termsOfService: '//a[contains(text(), "Terms of Service")]',
    signIn: '//a[contains(text(), "Sign in")]'
  },
  containers: {
    mainContent: "#main-content",
    header: "header.sticky",
    footer: "#reduced-footer",
    form: 'form[data-testid="registration-form"], form:has(input[name="email"])',
    loadingSpinner: '[data-testid="loading-spinner"]'
  },
  messages: {
    alertMsg: '[data-sentry-element="AlertDescription"]',
    successMessage: '[data-testid="success-message"]',
    errorMessage: '.error-message, .text-destructive',
    validationError: '.field-error, .validation-error'
  },
  captcha: {
    container: '[title="reCAPTCHA"]',
    checkbox: '#recaptcha-anchor',
    frame: 'iframe[title="reCAPTCHA"]'
  },

  expectedElements: {
    title: "HENCKELS US",
    url: "/register"
  },

  validation: {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    password: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true
    },
    name: {
      minLength: 2,
      maxLength: 50
    }
  },

    // Navigation Methods
    async navigateToPage(country = "us") {
      try {
        const url = `/${country}/register`;
        I.amOnPage(url);
        await this.verifyPageLoaded();
      } catch (error) {
        throw new Error(`Failed to navigate to registration page: ${error.message}`);
      }
  },
    
    // Form Input Methods
  async fillRegistrationForm(userData) {
    try {
      await this.validateUserData(userData);
      
      // Clear and fill all fields
      await this.fillEmail(userData.email);
      await this.fillFirstName(userData.firstName);
      await this.fillLastName(userData.lastName);
      await this.fillPassword(userData.password);
    } catch (error) {
      throw new Error(`Failed to fill registration form: ${error.message}`);
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

  async fillFirstName(firstName) {
    try {
      if (!firstName || !this._isValidName(firstName)) {
        throw new Error('Invalid first name provided');
      }
      await I.waitForElement(this.fields.firstName);
      I.clearField(this.fields.firstName);
      I.fillField(this.fields.firstName, firstName);
    } catch (error) {
      throw new Error(`Failed to fill first name: ${error.message}`);
    }
  },

  async fillLastName(lastName) {
    try {
      if (!lastName || !this._isValidName(lastName)) {
        throw new Error('Invalid last name provided');
      }
      await I.waitForElement(this.fields.lastName);
      I.clearField(this.fields.lastName);
      I.fillField(this.fields.lastName, lastName);
    } catch (error) {
      throw new Error(`Failed to fill last name: ${error.message}`);
    }
  },

  async fillPassword(password) {
    try {
      if (!password || !this._isValidPassword(password)) {
        throw new Error('Invalid password provided');
      }
      await I.waitForElement(this.fields.password);
      I.clearField(this.fields.password);
      I.fillField(this.fields.password, password);
    } catch (error) {
      throw new Error(`Failed to fill password: ${error.message}`);
    }
  },

  // Action Methods
  async acceptTermsAndConditions() {
    try {
      await I.waitForElement(this.buttons.acceptTerms);
      I.click(this.buttons.acceptTerms);
    } catch (error) {
      throw new Error(`Failed to accept terms and conditions: ${error.message}`);
    }
  },

  async submitForm() {
    try {
      await I.waitForElement(this.buttons.signUp);
      I.click(this.buttons.signUp);
    } catch (error) {
      throw new Error(`Failed to submit registration form: ${error.message}`);
    }
  },

  async acceptCaptcha() {
    try {
      await I.waitForElement(this.locators.captcha.frame, this.config.captchaTimeout);
      
      within({ frame: this.locators.captcha.container }, () => {
        I.click(this.locators.captcha.checkbox);
      });
      
      // Wait for CAPTCHA to be processed
      I.wait(2);
    } catch (error) {
      throw new Error(`Failed to accept CAPTCHA: ${error.message}`);
    }
  },

  // Navigation to Other Pages
  async goToSignIn() {
    try {
      await I.waitForElement(this.links.signIn);
      I.click(this.links.signIn);
    } catch (error) {
      throw new Error(`Failed to navigate to sign in page: ${error.message}`);
    }
  },

  async openPrivacyPolicy() {
    try {
      await I.waitForElement(this.links.privacyPolicy);
      I.click(this.links.privacyPolicy);
    } catch (error) {
      throw new Error(`Failed to open privacy policy: ${error.message}`);
    }
  },

  async openTermsOfService() {
    try {
      await I.waitForElement(this.links.termsOfService);
      I.click(this.links.termsOfService);
    } catch (error) {
      throw new Error(`Failed to open terms of service: ${error.message}`);
    }
  },

    // Validation and Verification Methods
    async verifyPageLoaded() {
      try {
        I.seeInTitle(this.expectedElements.title);
        await I.waitForElement(this.containers.mainContent);
        I.seeElement(this.containers.form);
      } catch (error) {
        throw new Error(`Registration page not loaded properly: ${error.message}`);
      }
  },
    
  async validateFormElements() {
    try {
      // Check all form fields are present and enabled
      for (const [fieldName, fieldSelector] of Object.entries(this.fields)) {
        
        I.seeElement(fieldSelector);
        I.seeElement(`${fieldSelector}:enabled`);
      }
      
      // Check buttons are present
      I.seeElement(this.buttons.signUp);
      I.seeElement(this.buttons.acceptTerms);
    } catch (error) {
      throw new Error(`Form validation failed: ${error.message}`);
    }
  },

  async hasValidationErrors() {
    try {
      const errorCount = await I.grabNumberOfVisibleElements(this.messages.errorMessage);
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
      const errorElements = await I.grabTextFromAll(this.messages.errorMessage);
      return errorElements;
    } catch (error) {
      console.error(`Error getting validation errors: ${error.message}`);
      return [];
    }
  },

  async verifyAlertMsg(expectedMessage) {
    try {
      console.log(`🔍 Verifying alert message: "${expectedMessage}"`);
      
      await I.waitForElement(this.messages.alertMsg);
      I.see(expectedMessage, this.messages.alertMsg);
    } catch (error) {
      throw new Error(`Alert message verification failed: ${error.message}`);
    }
  },

  async verifyRegistrationSuccess() {
    try {
      // Check if we're redirected away from registration page
      const currentUrl = await I.grabCurrentUrl();
      if (currentUrl.includes('/register')) {
        throw new Error('Still on registration page after registration attempt');
      }
      
      console.log('✅ Registration successful - redirected from registration page');
    } catch (error) {
      throw new Error(`Registration verification failed: ${error.message}`);
    }
  },

  // Utility Methods
  validateUserData(userData) {
    if (!userData) {
      throw new Error('User data is required');
    }
    
    const requiredFields = ['email', 'firstName', 'lastName', 'password'];
    for (const field of requiredFields) {
      if (!userData[field]) {
        throw new Error(`${field} is required`);
      }
    }
    
    if (!this._isValidEmail(userData.email)) {
      throw new Error('Valid email is required');
    }
    
    if (!this._isValidName(userData.firstName)) {
      throw new Error('Valid first name is required');
    }
    
    if (!this._isValidName(userData.lastName)) {
      throw new Error('Valid last name is required');
    }
    
    if (!this._isValidPassword(userData.password)) {
      throw new Error('Valid password is required');
    }
  },

  _isValidEmail(email) {
    return this.validation.email.test(email);
  },

  _isValidName(name) {
    return name && 
           name.length >= this.validation.name.minLength && 
           name.length <= this.validation.name.maxLength &&
           /^[a-zA-Z\s'-]+$/.test(name);
  },

  _isValidPassword(password) {
    if (!password || password.length < this.validation.password.minLength) {
      return false;
    }
    
    if (this.validation.password.requireUppercase && !/[A-Z]/.test(password)) {
      return false;
    }
    
    if (this.validation.password.requireLowercase && !/[a-z]/.test(password)) {
      return false;
    }
    
    if (this.validation.password.requireNumbers && !/\d/.test(password)) {
      return false;
    }
    
    return true;
  },
};