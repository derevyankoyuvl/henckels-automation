const { I } = inject()

/**
 * Sign In Page Object - Handles user authentication functionality
 * Uses Locator Builder pattern for better maintainability
 */
class SignInPage {
  constructor() {
    // Form input locators
    this.email = locate('input[name="email"]').as('Email Input')
    this.password = locate('input[name="password"]').as('Password Input')

    // Form action locators
    this.signInBtn = locate('button[type="submit"]').as('Sign In Button')
    this.resetPasswordBtn = locate('[data-sentry-component="ResetPassword"] button').as('Reset Password Button')
    this.signUpLink = locate('form [data-sentry-element="Link"]').as('Sign Up Link')

    // Page structure locators
    this.mainContent = locate('#main-content[role="main"]').as('Main Content')
  }

  // Navigation Methods
  navigateToPage(country = "us") {
    const url = `/${country}/login`
    I.amOnPage(url)
    this.verifyPageLoaded()
  }

  // Form Input Methods - removed async/await and clearField
  fillSignInCredentials(userData) {
    I.waitForElement(this.email)
    I.fillField(this.email, userData.email)  
    I.waitForElement(this.password)
    I.fillField(this.password, userData.password)
  }

  fillEmail(email) {
    I.waitForElement(this.email)
    I.fillField(this.email, email)
  }

  fillPassword(password) {
    I.waitForElement(this.password)
    I.fillField(this.password, password)
  }

  // Action Methods
  submitSignIn() {
    I.waitForElement(this.signInBtn)
    I.click(this.signInBtn)
  }

  // Navigation to Other Pages
  goToSignUp() {
    I.waitForElement(this.signUpLink)
    I.click(this.signUpLink)
  }

  goToResetPassword() {
    I.waitForElement(this.resetPasswordBtn)
    I.click(this.resetPasswordBtn)
  }

  // Validation and Verification Methods
  verifyPageLoaded() {
    // Local expected values instead of global constants
    const expectedTitle = "SIGN IN"
    const expectedUrlPath = "/login"

    I.seeInTitle(expectedTitle)
    I.waitForElement(this.mainContent)
    I.seeInCurrentUrl(expectedUrlPath)
  }

  verifyFormElements() {
    // Verify all required form elements are present
    I.seeElement(this.email)
    I.seeElement(this.password)
    I.seeElement(this.signInBtn)

    // Verify form elements are enabled
    I.dontSeeElement(this.email.withAttr('disabled'))
    I.dontSeeElement(this.password.withAttr('disabled'))
    I.dontSeeElement(this.signInBtn.withAttr('disabled'))
  }

  verifyNavigationLinks() {
    I.seeElement(this.signUpLink)
    I.seeElement(this.resetPasswordBtn)
  }
}

module.exports = new SignInPage()