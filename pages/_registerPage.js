const { I } = inject()

/**
 * Sign Up Page Object - Handles user registration functionality
 * Uses Locator Builder pattern for better maintainability
 */
class SignUpPage {
  constructor() {
    // Form input locators
    this.email = locate('input[name="email"]').as("Email Input")
    this.firstName = locate('input[name="firstName"]').as("First Name Input")
    this.lastName = locate('input[name="lastName"]').as("Last Name Input")
    this.password = locate('input[name="password"]').as("Password Input")

    // Form action locators
    this.signUpBtn = locate('button[type="submit"]').as("Sign Up Button")
    this.acceptTermsCheckbox = locate("#registration-accept").as(
      "Accept Terms Checkbox"
    )
    this.alertMsg = locate('[data-sentry-element="AlertDescription"]').as(
      "Alert Message"
    )
    
    // Navigation links
    this.privacyPolicyLink = locate("a")
      .withText("Privacy Policy")
      .as("Privacy Policy Link")
    this.termsOfServiceLink = locate("a")
      .withText("Terms of Service")
      .as("Terms of Service Link")
    this.signInLink = locate("a").withText("Sign in").as("Sign In Link")

    // Page structure locators
    this.mainContent = locate("#main-content").as("Main Content")

    // CAPTCHA locators
    this.captchaContainer = locate('[title="reCAPTCHA"]').as(
      "CAPTCHA Container"
    )
    this.captchaCheckbox = locate("#recaptcha-anchor").as("CAPTCHA Checkbox")
    this.captchaFrame = locate('iframe[title="reCAPTCHA"]').as("CAPTCHA Frame")
  }

  // Navigation Methods
  navigateToPage(country = "us") {
    const url = `/${country}/register`
    I.amOnPage(url)
    this.verifyPageLoaded()
  }

  // Form Input Methods - removed async/await and clearField
  fillRegistrationForm(userData) {
    // Fill all fields
    this.fillEmail(userData.email)
    this.fillFirstName(userData.firstName)
    this.fillLastName(userData.lastName)
    this.fillPassword(userData.password)
  }

  fillEmail(email) {
    I.waitForElement(this.email)
    I.fillField(this.email, email)
  }

  fillFirstName(firstName) {
    I.waitForElement(this.firstName)
    I.fillField(this.firstName, firstName)
  }

  fillLastName(lastName) {
    I.waitForElement(this.lastName)
    I.fillField(this.lastName, lastName)
  }

  fillPassword(password) {
    I.waitForElement(this.password)
    I.fillField(this.password, password)
  }

  // Action Methods
  acceptTermsAndConditions() {
    I.waitForElement(this.acceptTermsCheckbox)
    I.checkOption(this.acceptTermsCheckbox)
  }

  submitForm() {
    I.waitForElement(this.signUpBtn)
    I.click(this.signUpBtn)
  }

  acceptCaptcha() {
    // Local timeout variable instead of global config
    const captchaTimeout = 10

    I.waitForElement(this.captchaFrame, captchaTimeout)

    within({ frame: this.captchaContainer }, () => {
      I.click(this.captchaCheckbox)
    })

    // Wait for CAPTCHA to be processed
    I.wait(2)
  }

  // Complete registration flow
  completeRegistration(userData) {
    this.fillRegistrationForm(userData)
    this.acceptTermsAndConditions()

    // Handle CAPTCHA if present
    try {
      this.acceptCaptcha()
    } catch (error) {
      console.log("CAPTCHA not present or already completed")
    }

    this.submitForm()
  }

  // Navigation to Other Pages
  goToSignIn() {
    I.waitForElement(this.signInLink)
    I.click(this.signInLink)
  }

  openPrivacyPolicy() {
    I.waitForElement(this.privacyPolicyLink)
    I.click(this.privacyPolicyLink)
  }

  openTermsOfService() {
    I.waitForElement(this.termsOfServiceLink)
    I.click(this.termsOfServiceLink)
  }

  // Validation and Verification Methods
  verifyPageLoaded() {
    // Local expected values instead of global constants
    const expectedTitle = "HENCKELS US"
    const expectedUrlPath = "/register"

    I.seeInTitle(expectedTitle)
    I.waitForElement(this.mainContent)
    I.seeInCurrentUrl(expectedUrlPath)
  }

  validateFormElements() {
    // Check all form fields are present and enabled
    const formFields = [
      this.email,
      this.firstName,
      this.lastName,
      this.password,
    ]

    formFields.forEach((field) => {
      I.seeElement(field)
      // Check field is enabled by verifying it doesn't have disabled attribute
      I.dontSeeElement(field.withAttr("disabled"))
    })

    // Check buttons are present
    I.seeElement(this.signUpBtn)
    I.seeElement(this.acceptTermsCheckbox)
  }

  // CAPTCHA-specific methods
  verifyCaptchaPresent() {
    I.seeElement(this.captchaContainer)
    I.seeElement(this.captchaFrame)
  }

  verifyCaptchaCompleted() {
    // Check if CAPTCHA checkbox is checked
    const checkedCaptcha = locate(this.captchaCheckbox).withAttr(
      "aria-checked",
      "true"
    )
    I.seeElement(checkedCaptcha)
  }

  async verifyAlertMsg(expectedMessage) {
    await I.waitForElement(this.alertMsg)
    I.see(expectedMessage, this.alertMsg)
  }
}

module.exports = new SignUpPage()
