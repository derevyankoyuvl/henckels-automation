const { I } = inject()

/**
 * Checkout Page Object - Handles checkout process and payment functionality
 * Uses Locator Builder pattern for better maintainability
 */
class CheckoutPage {
  constructor() {
    // Guest locators
    this.guestSignUpBtn = locate('[data-sid="contact_register"]').as(
      "Guest Sign Up Button"
    )
    this.guestLoginBtn = locate('[data-sid="contact_login"]').as(
      "Guest Login Button"
    )
    this.guestEmailInput = locate('[data-sid="contact_email"]').as(
      "Guest Email Input"
    )

    // Shipping section locators
    this.shippingSection = locate(
      '[data-sentry-component="ShippingAddressSection"]'
    ).as("Shipping Section")
    this.shippingFirstNameInput = locate("#firstName")
      .inside(this.shippingSection)
      .as("Shipping First Name Input")
    this.shippingLastNameInput = locate("#lastName")
      .inside(this.shippingSection)
      .as("Shipping Last Name Input")
    this.shippingAddressInput = locate("#address1")
      .inside(this.shippingSection)
      .as("Shipping Address Input")
    this.shippingAddress2Input = locate("#address2")
      .inside(this.shippingSection)
      .as("Shipping Address 2 Input")
    this.shippingCityInput = locate("#city")
      .inside(this.shippingSection)
      .as("Shipping City Input")
    this.shippingStateSelect = locate('button[aria-label="stateCode"]')
      .inside(this.shippingSection)
      .as("Shipping State Select")
    this.shippingZipInput = locate("#postalCode")
      .inside(this.shippingSection)
      .as("Shipping Zip Input")
    this.shippingCountrySelect = locate(
      '[data-sid="accountform_countrycode_1"]'
    )
      .inside(this.shippingSection)
      .as("Shipping Country Select")
    this.shippingPhoneInput = locate('[name="phone"]')
      .inside(this.shippingSection)
      .as("Shipping Phone Input")

    // Billing section locators
    this.billingSection = locate(
      '[data-sentry-component="BillingAddressSection"]'
    ).as("Billing Section")
    this.billingSameAsShippingCheckbox = locate(
      '[data-sid="checkout_useshipping"]'
    ).as("Billing Same As Shipping Checkbox")
    this.billingFirstNameInput = locate("#firstName")
      .inside(this.billingSection)
      .as("Billing First Name Input")
    this.billingLastNameInput = locate("#lastName")
      .inside(this.billingSection)
      .as("Billing Last Name Input")
    this.billingAddressInput = locate("#address1")
      .inside(this.billingSection)
      .as("Billing Address Input")
    this.billingAddress2Input = locate("#address2")
      .inside(this.billingSection)
      .as("Billing Address 2 Input")
    this.billingCityInput = locate("#city")
      .inside(this.billingSection)
      .as("Billing City Input")
    this.billingStateSelect = locate('button[aria-label="stateCode"]')
      .inside(this.billingSection)
      .as("Billing State Select")
    this.billingZipInput = locate("#postalCode")
      .inside(this.billingSection)
      .as("Billing Zip Input")
    this.billingCountrySelect = locate('button[aria-label="countryCode"]')
      .inside(this.billingSection)
      .as("Billing Country Select")
    this.billingPhoneCountrySelect = locate(
      '[data-sid="accountform_countrycode_1"]'
    )
      .inside(this.billingSection)
      .as("Billing Phone Country Select")
    this.billingPhoneInput = locate('[name="phone"]')
      .inside(this.billingSection)
      .as("Billing Phone Input")

    // Address normalosation modal
    this.addressNormalisationModal = locate(
      '[data-sentry-element="DialogContent"]'
    ).as("Address Normalisation Modal")
    this.keepAddressBtn = locate('[data-sentry-element="Button"]')
      .inside(this.addressNormalisationModal)
      .first()
      .as("Keep Address Button")

    // Payment section locators
    this.paymentSection = locate("#payment-section").as("Payment Section")
    this.paymentCreditCardOption = locate('[for="opt-scheme"]').as(
      "Credit Card Payment Option"
    )
    this.paymentGiftCardOption = locate('[for="opt-giftcard"]').as(
      "Gift Card Payment Option"
    )
    this.paymentGooglePayOption = locate('[for="opt-googlepay"]').as(
      "Google Pay Payment Option"
    )
    this.paymentPaypalOption = locate('[for="opt-paypal"]').as(
      "PayPal Payment Option"
    )
    this.paymentApplePayOption = locate('[for="opt-applepay"]').as(
      "Apple Pay Payment Option"
    )
    this.paymentKlarnaOption = locate('[for="opt-klarna_account"]').as(
      "Klarna Payment Option"
    )

    // Payment frame locators
    this.paymentCardNumberFrame = locate('[title="Iframe for card number"]').as(
      "Card Number Frame"
    )
    this.paymentExpiryFrame = locate('[title="Iframe for expiry date"]').as(
      "Expiry Date Frame"
    )
    this.paymentCvvFrame = locate('[title="Iframe for security code"]').as(
      "CVV Frame"
    )
    this.paymentGCPinFrame = locate('[title="Iframe for pin"]').as(
      "Gift Card Pin Frame"
    )

    // Payment input locators
    this.paymentCardNumberInput = locate(
      "input[id^='adyen-checkout-encryptedCardNumber']"
    ).as("Card Number Input")
    this.paymentExpiryDateInput = locate(
      "input[id^='adyen-checkout-encryptedExpiryDate']"
    ).as("Expiry Date Input")
    this.paymentCvvInput = locate(
      "input[id^='adyen-checkout-encryptedSecurityCode']"
    ).as("CVV Input")
    this.paymentCardholderNameInput = locate('input[name="holderName"]').as(
      "Cardholder Name Input"
    )
    this.paymentGiftCardNumberInput = locate(
      'input[data-fieldtype="encryptedCardNumber"]'
    ).as("Gift Card Number Input")
    this.paymentGiftCardPinInput = locate(
      'input[data-fieldtype="encryptedSecurityCode"]'
    ).as("Gift Card Pin Input")
    this.redeemGCBtn = locate('[data-sid="checkout_checkgiftcard"]').as(
      "Redeem Gift Card Button"
    )
    this.removeGCBtn = locate(
      '[aria-label="Remove gift card payment method"]'
    ).as("Remove Gift Card Button")

    // Order Summary locators
    this.orderSummarySection = locate('[data-sentry-element="Card"]').as(
      "Order Summary Section"
    ) // Need to improve locator
    this.orderSummaryItemName = locate('[data-testid="order-item-name"]').as(
      "Order Item Name"
    ) // Need to improve locator
    this.orderSummaryItemPrice = locate('[data-testid="order-item-price"]').as(
      "Order Item Price"
    ) // Need to improve locator
    this.orderSummaryItemQuantity = locate(
      '[data-testid="order-item-quantity"]'
    ).as("Order Item Quantity") // Need to improve locator
    this.orderSummarySubtotalAmount = locate(
      '[data-testid="order-subtotal"]'
    ).as("Order Subtotal Amount") // Need to improve locator
    this.orderSummaryTaxAmount = locate('[data-testid="order-tax"]').as(
      "Order Tax Amount"
    ) // Need to improve locator
    this.orderSummaryShippingAmount = locate(
      '[data-testid="order-shipping"]'
    ).as("Order Shipping Amount") // Need to improve locator
    this.orderSummaryDiscountAmount = locate(
      '[data-testid="order-discount"]'
    ).as("Order Discount Amount") // Need to improve locator
    this.orderSummaryTotalAmount = locate('[data-testid="order-total"]').as(
      "Order Total Amount"
    ) // Need to improve locator

    // Promo Code locators
    this.promoCodeSection = locate('[data-sentry-component="PromoCode"]').as(
      "Promo Code Section"
    )
    this.promoCodeInput = locate('[data-sid="checkout_promocode_input"]').last().as(
      "Promo Code Input"
    )
    this.promoCodeApplyBtn = locate('[data-sid="checkout_promocode_apply"]').as(
      "Promo Code Apply Button"
    )
    this.promoCodeMessage = locate("form.w-full>div>div").last().as(
      "Promo Code Message"
    ) // Need to improve locator
    this.promoCodeRemoveBtn = locate('[data-testid="remove-promo"]').as(
      "Promo Code Remove Button"
    ) // Need to improve locator

    // Agreements locators
    this.agreementsNewsletterCheckbox = locate("#newsSignUp-accept").as(
      "Newsletter Checkbox"
    )
    this.agreementsTermsConditionsLnk = locate(
      '#payment-section a[href*="terms"]'
    ).as("Terms and Conditions Link")

    // Navigation locators
    this.continueBtn = locate(
      '//button[contains(text(), "Save & Continue")]'
    ).as("Continue Button")
    this.placeOrderBtn = locate('button[data-sid="checkout_paynow"]').as(
      "Place Order Button"
    )
    this.editEmail = locate(
      '[data-sentry-component="ContactInfoCard"] [title="Edit customer information"]'
    ).as("Edit Email Button")
    this.editShippingBtn = locate(
      '[data-sentry-component="ShippingAddressSection"] [title="Edit customer information"]'
    ).as("Edit Shipping Button")
    this.confirmPayment = locate(
      'button[data-sid="checkout_giftcard_button"]'
    ).as("Confirm Payment Button")

    // PayPal locators
    this.paypalFrame = 'iframe[title="PayPal"]'
    this.paypalEmailInput = locate("#email").as("PayPal Email Input")
    this.paypalPasswordInput = locate("#password").as("PayPal Password Input")
    this.paypalNextBtn = locate("#btnNext").as("PayPal Next Button")
    this.paypalLoginBtn = locate("#btnLogin").as("PayPal Login Button")
    this.paypalSubmitBtn = locate(
      'button[data-testid="submit-button-initial"]'
    ).as("PayPal Submit Button")
    this.paypalPayButton = locate('[aria-label="PayPal"]').as(
      "PayPal Pay Button"
    )

    // Klarna locators
    this.klarnaPhoneNumberInput = locate("#phone").as(
      "Klarna Phone Number Input"
    )
    this.klarnaContinueBtn = locate("#onContinue").as("Klarna Continue Button")
    this.klarnaOtpCodeInput = locate("#otp_field").as("Klarna OTP Code Input")
    this.klarnaContinueWithPlan = locate('[data-testid="pick-plan"]').as(
      "Klarna Continue With Plan"
    )
    this.klarnaSubmitBtn = locate("#klarna-container button").as(
      "Klarna Submit Button"
    )
    this.klarnaBuyBtn = locate("#buy_button").as("Klarna Buy Button")

    // Google Pay locators
    this.googlePaySubmitBtn = locate("#gpay-button-online-api-id").as(
      "Google Pay Submit Button"
    )
    this.googlePayModal = locate('[role="dialog"]').as("Google Pay Modal")
    this.googlePayEmailInput = locate("input[type='email']").as(
      "Google Pay Email Input"
    )
    this.googlePayNextBtn = locate("#identifierNext").as(
      "Google Pay Next Button"
    )
    this.googlePayPasswordInput = locate("input[type='password']").as(
      "Google Pay Password Input"
    )
    this.googlePayPasswordNextBtn = locate("#passwordNext").as(
      "Google Pay Password Next Button"
    )
    this.googlePayBtn = locate('.smGnHb [jsname="LgbsSe"]').as(
      "Google Pay Button"
    )

    // Dynamic locators
    this.stateOption = (stateName) =>
      locate("option").withText(stateName).as(`${stateName} State Option`)
    this.countryOption = (countryName) =>
      locate("option").withText(countryName).as(`${countryName} Country Option`)

    // Constants
    this.PAYMENT_METHODS = {
      CREDIT_CARD: "credit_card",
      PAYPAL: "paypal",
      APPLE_PAY: "apple_pay",
      GOOGLE_PAY: "googlepay",
      KLARNA: "klarna",
      GIFT_CARD: "gift_card",
    }

    this.CARD_TYPES = {
      VISA: "visa",
      MASTERCARD: "mastercard",
      AMEX: "amex",
      DISCOVER: "discover",
      JCB: "jcb",
      DINERS: "diners",
      UNIONPAY: "unionpay",
    }
  }

  // ===== SHIPPING INFORMATION METHODS =====

  fillGuestEmail(shippingData) {
    I.fillField(this.guestEmailInput, shippingData.email)
  }

  // Fill shipping information
  fillShippingInformation(shippingData) {
    // Fill required fields
    I.fillField(this.shippingFirstNameInput, shippingData.firstName)
    I.fillField(this.shippingLastNameInput, shippingData.lastName)
    I.fillField(this.shippingAddressInput, shippingData.address)

    // Tab to trigger address validation
    I.wait(1) // Allow autocomplete to appear
    I.pressKey("Escape") // Dismiss any autocomplete dropdown
    I.wait(0.5) // Allow dropdown to disappear

    // Fill optional address line 2
    if (shippingData.address2) {
      I.fillField(this.shippingAddress2Input, shippingData.address2)
    }

    I.fillField(this.shippingCityInput, shippingData.city)
    I.click(this.shippingStateSelect)
    I.click(shippingData.state)
    I.fillField(this.shippingZipInput, shippingData.zip)
    I.fillField(this.shippingPhoneInput, shippingData.phone)
  }

  async keepEnteredAddress() {
    // Wait 2 seconds for modal to potentially appear
    I.wait(2)
    // Count visible elements matching the modal selector
    const elementCount = await I.grabNumberOfVisibleElements(
      this.addressNormalisationModal
    )
    if (elementCount > 0) {
      I.waitForElement(this.keepAddressBtn)
      I.click(this.keepAddressBtn)
      I.waitForElement(this.continueBtn)
      I.click(this.continueBtn)
      // I.waitForElement(this.placeOrderBtn)
      // I.click(this.placeOrderBtn)
    }
  }

  editShippingAddress() {
    I.waitForElement(this.editShippingBtn)
    I.click(this.editShippingBtn)
  }

  // ===== BILLING INFORMATION METHODS =====

  useSameAsShipping() {
    I.waitForElement(this.billingSameAsShippingCheckbox)
    I.checkOption(this.billingSameAsShippingCheckbox)
  }

  async fillBillingInformation(billingData) {
    await this.validateBillingData(billingData)

    // Uncheck same as shipping first
    I.uncheckOption(this.billingSameAsShippingCheckbox)
    I.waitForElement(this.billingFirstNameInput)

    I.fillField(this.billingFirstNameInput, billingData.firstName)
    I.fillField(this.billingLastNameInput, billingData.lastName)
    I.fillField(this.billingAddressInput, billingData.address)

    if (billingData.address2) {
      I.fillField(this.billingAddress2Input, billingData.address2)
    }

    I.fillField(this.billingCityInput, billingData.city)
    I.selectOption(this.billingStateSelect, billingData.state)
    I.fillField(this.billingZipInput, billingData.zip)
    I.selectOption(this.billingCountrySelect, billingData.country)
    I.fillField(this.billingPhoneInput, billingData.phone)
  }

  // ===== PAYMENT METHODS =====

  selectPaymentMethod(method) {
    I.waitForElement(this.paymentSection)

    let paymentSelector
    switch (method.toLowerCase()) {
      case this.PAYMENT_METHODS.CREDIT_CARD:
        paymentSelector = this.paymentCreditCardOption
        break
      case this.PAYMENT_METHODS.PAYPAL:
        paymentSelector = this.paymentPaypalOption
        break
      case this.PAYMENT_METHODS.APPLE_PAY:
        paymentSelector = this.paymentApplePayOption
        break
      case this.PAYMENT_METHODS.GOOGLE_PAY:
        paymentSelector = this.paymentGooglePayOption
        break
      case this.PAYMENT_METHODS.KLARNA:
        paymentSelector = this.paymentKlarnaOption
        break
      case this.PAYMENT_METHODS.GIFT_CARD:
        paymentSelector = this.paymentGiftCardOption
        break
      default:
        throw new Error(`Unknown payment method: ${method}`)
    }

    I.waitForElement(paymentSelector)
    I.click(paymentSelector)
  }

  fillCreditCardInformation(cardType, cardData) {
    const card = cardData[cardType]

    // Wait for payment frames to load
    I.waitForElement(this.paymentCardNumberFrame)

    // Fill card number
    within({ frame: this.paymentCardNumberFrame }, () => {
      I.fillField(this.paymentCardNumberInput, card.number)
    })

    // Fill expiry date
    within({ frame: this.paymentExpiryFrame }, () => {
      I.fillField(this.paymentExpiryDateInput, card.expiryDate)
    })

    // Fill CVV
    within({ frame: this.paymentCvvFrame }, () => {
      I.fillField(this.paymentCvvInput, card.cvv)
    })

    // MORE EXPLICIT CONTEXT RESET
    I.switchTo(null) // Switch to main frame explicitly
    I.switchTo() // Additional switchTo call

    // Fill cardholder name (outside iframe)
    I.fillField(this.paymentCardholderNameInput, card.cardholderName)
  }

  fillGiftCardInformation(cardType, cardData) {
    const card = cardData[cardType]
    // Wait for payment frames to load
    I.waitForElement(this.paymentCardNumberFrame)

    // Fill card number
    within({ frame: this.paymentCardNumberFrame }, () => {
      I.fillField(this.paymentGiftCardNumberInput, card.number)
    })

    // Fill pin
    within({ frame: this.paymentGCPinFrame }, () => {
      I.fillField(this.paymentGiftCardPinInput, card.pin)
    })

    // MORE EXPLICIT CONTEXT RESET
    I.switchTo(null) // Switch to main frame explicitly
    I.switchTo() // Additional switchTo call
    I.click(this.redeemGCBtn)
  }

  // ===== PROMO CODE METHODS =====

  applyPromoCode(promoCode) {
    I.waitForElement(this.promoCodeInput)
    I.fillField(this.promoCodeInput, promoCode)
    I.click(this.promoCodeApplyBtn)

    // Wait for promo code processing
    I.waitForElement(this.promoCodeMessage)
  }

  removePromoCode() {
    I.waitForElement(this.promoCodeRemoveBtn)
    I.click(this.promoCodeRemoveBtn)
  }

  // Agreement Methods

  subscribeToNewsletter() {
    I.waitForElement(this.agreementsNewsletterCheckbox)
    I.checkOption(this.agreementsNewsletterCheckbox)
  }

  // ===== ORDER COMPLETION METHODS =====

  submitOrder() {
    // I.wait(3) // Need to improve this
    // Wait for iframe context to clear by checking main page elements
    I.waitForElement(this.placeOrderBtn)

    // Ensure place order button is enabled and click
    I.click(this.placeOrderBtn)
  }

  submitOrderWithGiftCard() {
    I.waitForElement(this.removeGCBtn)
    I.waitForElement(this.confirmPayment)
    I.click(this.confirmPayment)
  }

  submitOrderWithPayPal(credentials = {}) {
    // Use credentials from environment variables, fallback to defaults if not set
    const defaultCredentials = {
      email: process.env.PAYPAL_TEST_EMAIL,
      password: process.env.PAYPAL_TEST_PASSWORD,
    }

    const paypalCredentials = { ...defaultCredentials, ...credentials }

    // Wait for PayPal iframe
    I.waitForElement(this.paypalFrame)

    // Click PayPal button in iframe
    I.wait(1)
    within({ frame: `${this.paypalFrame}.visible` }, () => {
      I.click(this.paypalPayButton)
    })

    // Wait for PayPal popup window
    I.waitForNumberOfTabs(2, 10)
    I.switchToNextTab()

    // Handle PayPal login
    this._handlePayPal(paypalCredentials)

    // Switch back to main window
    I.switchToPreviousTab()
  }

  _handlePayPal(credentials) {
    // Enter email
    I.waitForElement(this.paypalEmailInput)
    I.fillField(this.paypalEmailInput, credentials.email)
    I.click(this.paypalNextBtn)

    // Enter password
    I.waitForElement(this.paypalPasswordInput)
    I.fillField(this.paypalPasswordInput, credentials.password)
    I.click(this.paypalLoginBtn)

    // Complete payment
    I.waitForElement(this.paypalSubmitBtn)
    I.click(this.paypalSubmitBtn)
  }

  // Order Completion Methods
  continueToNextStep() {
    I.waitForElement(this.continueBtn)
    I.click(this.continueBtn)
  }

  // Verification Methods
  verifyOrderTotal(expectedTotal) {
    I.waitForElement(this.orderSummaryTotalAmount)
    I.see(expectedTotal, this.orderSummaryTotalAmount)
  }

  verifyShippingCost(expectedCost) {
    I.waitForElement(this.orderSummaryShippingAmount)
    I.see(expectedCost, this.orderSummaryShippingAmount)
  }

  verifyPromoCodeApplied(discountAmount) {
    I.see("Promo code applied", this.promoCodeMessage)
    I.see(discountAmount, this.orderSummaryDiscountAmount)
  }

  verifyPageLoaded() {
    I.waitForElement(this.shippingSection)
    I.seeElement(this.shippingSection)
  }

  async submitOrderWithKlarna(credentials = {}) {
    // Use credentials from environment variables, fallback to defaults if not set
    const defaultCredentials = {
      phone: process.env.KLARNA_PHONE_US,
      otp: process.env.KLARNA_OTP,
    }

    const klarnaCredentials = { ...defaultCredentials, ...credentials }

    I.waitForElement(this.klarnaSubmitBtn)
    I.click(this.klarnaSubmitBtn)

    // Handle Klarna login
    await this._handleKlarnaPayment(klarnaCredentials)
  }

  async _handleKlarnaPayment(credentials) {
    // Enter phone number
    I.waitForElement(this.klarnaPhoneNumberInput)
    I.fillField(this.klarnaPhoneNumberInput, credentials.phone)
    I.click(this.klarnaContinueBtn)

    // Enter OTP code
    I.waitForElement(this.klarnaOtpCodeInput)
    I.fillField(this.klarnaOtpCodeInput, credentials.otp)
    const elementCount = await I.grabNumberOfVisibleElements(
      this.klarnaContinueWithPlan
    )
    if (elementCount > 0) {
      I.click(this.klarnaContinueWithPlan)
    }
    // I.waitForElement(this.klarnaContinueWithPlan)
    // I.click(this.klarnaContinueWithPlan)

    // Complete payment
    I.waitForElement(this.klarnaBuyBtn)
    I.click(this.klarnaBuyBtn)
  }

  async setupTestEnvironment() {
    // Set test environment flag
    await I.executeScript(() => {
      localStorage.setItem("GOOGLE_PAY_TEST_MODE", "true")
      // Or set it globally
      window.GOOGLE_PAY_ENVIRONMENT = "TEST"
    })
  }

  // async submitOrderWithGooglePay(credentials = {}) {
  //   await this.setupTestEnvironment()
  //   // Use credentials from environment variables, fallback to defaults if not set
  //   const defaultCredentials = {
  //     email: process.env.GOOGLEPAY_TEST_EMAIL,
  //     password: process.env.GOOGLEPAY_TEST_PASSWORD,
  //   }

  //   const googlepayCredentials = { ...defaultCredentials, ...credentials }

  //   // Wait for GooglePay Submit button
  //   I.waitForElement(this.googlePaySubmitBtn)
  //   I.click(this.googlePaySubmitBtn)

  //   // Handle GooglePay login
  //   this._handleGooglePay(googlepayCredentials)
  // }

  // _handleGooglePay(credentials) {
  //   // Enter email
  //   I.waitForElement(this.googlePayModal)

  //   within({ frame: '[src^="https://pay.google.com/gp/p/ui/payframe"]'}, () => {
  //     I.fillField(this.googlePayEmailInput, credentials.email)
  //     I.click(this.googlePayNextBtn)
  //   })

  //   // Enter password
  //   I.waitForElement(this.googlePayPasswordInput)
  //   I.fillField(this.googlePayPasswordInput, credentials.password)
  //   I.click(this.googlePayPasswordNextBtn)

  //   // Complete payment
  //   I.waitForElement(this.googlePayBtn)
  //   I.click(this.googlePayBtn)
  // }
}

module.exports = new CheckoutPage()
