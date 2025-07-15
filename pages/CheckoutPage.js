const { I } = inject();

/**
 * Checkout Page Object - Handles checkout process and payment functionality
 */
module.exports = {
  // Organized locators by logical sections
  guest: {
    signUpBtn: '[data-sid="contact_register"]',
    loginBtn: '[data-sid="contact_login"]',
    emailInput: '[data-sid="contact_email"]',
  },

  shipping: {
    section: '[data-sentry-component="ShippingAddressSection"]',
    firstNameInput:
      '[data-sentry-component="ShippingAddressSection"] #firstName',
    lastNameInput: '[data-sentry-component="ShippingAddressSection"] #lastName',
    addressInput: '[data-sentry-component="ShippingAddressSection"] #address1',
    address2Input: '[data-sentry-component="ShippingAddressSection"] #address2',
    cityInput: '[data-sentry-component="ShippingAddressSection"] #city',
    stateSelect:
      '[data-sentry-component="ShippingAddressSection"] button[aria-label="stateCode"]',

    zipInput: '[data-sentry-component="ShippingAddressSection"] #postalCode',
    countrySelect:
      '[data-sentry-component="ShippingAddressSection"][data-sid="accountform_countrycode_1"]',
    phoneInput:
      '[data-sentry-component="ShippingAddressSection"] [name="phone"]',
  },

  billing: {
    section: '[data-sentry-component="BillingAddressSection"]',
    sameAsShippingCheckbox: '[data-sid="checkout_useshipping"]',
    firstNameInput:
      '[data-sentry-component="BillingAddressSection"] #firstName',
    lastNameInput: '[data-sentry-component="BillingAddressSection"] #lastName',
    addressInput: '[data-sentry-component="BillingAddressSection"] #address1',
    address2Input: '[data-sentry-component="BillingAddressSection"] #address2',
    cityInput: '[data-sentry-component="BillingAddressSection"] #city',
    stateSelect:
      '[data-sentry-component="BillingAddressSection"] button[aria-label="stateCode"]',
    zipInput: '[data-sentry-component="BillingAddressSection"] #postalCode',
    countrySelect:
      '[data-sentry-component="BillingAddressSection"] button[aria-label="countryCode"]',
    phoneCountrySelect:
      '[data-sentry-component="BillingAddressSection"] [data-sid="accountform_countrycode_1"]',
    phoneInput:
      '[data-sentry-component="BillingAddressSection"] [name="phone"]',
  },

  payment: {
    section: "#payment-section",
    creditCardOption: '[for="opt-scheme"]',
    giftCardOption: '[for="opt-giftcard"]',
    googlePayOption: '[for="opt-googlepay"]',
    paypalOption: '[for="opt-paypal"]',
    applePayOption: '[for="opt-applepay"]',
    klarnaOption: '[for="opt-klarna"]',

    // Credit card frames and inputs
    cardNumberFrame: '[title="Iframe for card number"]',
    expiryFrame: '[title="Iframe for expiry date"]',
    cvvFrame: '[title="Iframe for security code"]',
    cardNumberInput: "input[id^='adyen-checkout-encryptedCardNumber']",
    expiryDateInput: "input[id^='adyen-checkout-encryptedExpiryDate']",
    cvvInput: "input[id^='adyen-checkout-encryptedSecurityCode']",
    cardholderNameInput: 'input[name="holderName"]',
  },

  orderSummary: {
    section: '[data-sentry-element="Card"]',
    itemName: '[data-testid="order-item-name"]', // Need to improve locator
    itemPrice: '[data-testid="order-item-price"]', // Need to improve locator
    itemQuantity: '[data-testid="order-item-quantity"]', // Need to improve locator
    subtotalAmount: '[data-testid="order-subtotal"]', // Need to improve locator
    taxAmount: '[data-testid="order-tax"]', // Need to improve locator
    shippingAmount: '[data-testid="order-shipping"]', // Need to improve locator
    discountAmount: '[data-testid="order-discount"]', // Need to improve locator
    totalAmount: '[data-testid="order-total"]', // Need to improve locator
  },

  promoCode: {
    section: '[data-sentry-component="PromoCode"]',
    input: '[data-sid="checkout_promocode_input"]',
    applyBtn: '[data-sid="checkout_promocode_apply"]',
    message: '[data-testid="promo-message"]', // Need to improve locator
    removeBtn: '[data-testid="remove-promo"]', // Need to improve locator
  },

  agreements: {
    newsletterCheckbox: "#newsSignUp-accept",
    termsConditionsLnk: '#payment-section a[href*="terms"]',
  },

  navigation: {
    continueBtn: '//button[contains(text(), "Save & Continue")]',
    placeOrderBtn: "button[data-sid='checkout_paynow']",
    editEmail:
      '[data-sentry-component="ContactInfoCard"] [title="Edit customer information"]',
    editShippingBtn:
      '[data-sentry-component="ShippingAddressSection"] [title="Edit customer information"]',
  },

  paypal: {
    frame: 'iframe[title="PayPal"]',
    emailInput: "#email",
    passwordInput: "#password",
    nextBtn: "#btnNext",
    loginBtn: "#btnLogin",
    submitBtn: 'button[data-testid="submit-button-initial"]',
    payButton: '[aria-label="PayPal"]',
  },

  // Constants
  PAYMENT_METHODS: {
    CREDIT_CARD: "credit_card",
    PAYPAL: "paypal",
    APPLE_PAY: "apple_pay",
    GOOGLE_PAY: "googlepay",
    KLARNA: "klarna",
    GIFT_CARD: "gift_card",
  },

  CARD_TYPES: {
    VISA: "visa",
    MASTERCARD: "mastercard",
    AMEX: "amex",
    DISCOVER: "discover",
    JCB: "jcb",
    DINERS: "diners",
    UNIONPAY: "unionpay",
  },

  // ===== SHIPPING INFORMATION METHODS =====

  async fillGuestEmail(shippingData) {
    // Fill email if provided and not already filled
    if (shippingData.email) {
      try {
        I.clearField(this.guest.emailInput);
        I.fillField(this.guest.emailInput, shippingData.email);
      } catch (emailError) {
        console.log("Email field not available or already filled");
      }
    }
  },

  // Fill shipping information
  async fillShippingInformation(shippingData) {
    try {
      await this.validateShippingData(shippingData);

      // Fill required fields
      I.clearField(this.shipping.firstNameInput);
      I.fillField(this.shipping.firstNameInput, shippingData.firstName);

      I.clearField(this.shipping.lastNameInput);
      I.fillField(this.shipping.lastNameInput, shippingData.lastName);

      I.clearField(this.shipping.addressInput);
      I.fillField(this.shipping.addressInput, shippingData.address);

      // Tab to trigger address validation
      I.pressKey("Tab");

      // Fill optional address line 2
      if (shippingData.address2) {
        I.clearField(this.shipping.address2Input);
        I.fillField(this.shipping.address2Input, shippingData.address2);
      }

      I.clearField(this.shipping.cityInput);
      I.fillField(this.shipping.cityInput, shippingData.city);

      I.click(this.shipping.stateSelect);
      I.click(shippingData.state);

      I.clearField(this.shipping.zipInput);
      I.fillField(this.shipping.zipInput, shippingData.zip);

      I.clearField(this.shipping.phoneInput);
      I.fillField(this.shipping.phoneInput, shippingData.phone);
    } catch (error) {
      throw new Error(`Failed to fill shipping information: ${error.message}`);
    }
  },

  async editShippingAddress() {
    try {
      await I.waitForElement(this.navigation.editShippingBtn);
      I.click(this.navigation.editShippingBtn);
    } catch (error) {
      throw new Error(`Failed to edit shipping address: ${error.message}`);
    }
  },

  // ===== BILLING INFORMATION METHODS =====
  // Billing Information Methods
  async useSameAsShipping() {
    try {
      await I.waitForElement(this.billing.sameAsShippingCheckbox);
      I.checkOption(this.billing.sameAsShippingCheckbox);
    } catch (error) {
      throw new Error(`Failed to use same as shipping: ${error.message}`);
    }
  },

  async fillBillingInformation(billingData) {
    try {
      console.log("💳 Filling billing information");

      await this.validateBillingData(billingData);

      // Uncheck same as shipping first
      I.uncheckOption(this.billing.sameAsShippingCheckbox);
      await I.waitForElement(this.billing.firstNameInput);

      I.clearField(this.billing.firstNameInput);
      I.fillField(this.billing.firstNameInput, billingData.firstName);

      I.clearField(this.billing.lastNameInput);
      I.fillField(this.billing.lastNameInput, billingData.lastName);

      I.clearField(this.billing.addressInput);
      I.fillField(this.billing.addressInput, billingData.address);

      if (billingData.address2) {
        I.clearField(this.billing.address2Input);
        I.fillField(this.billing.address2Input, billingData.address2);
      }

      I.clearField(this.billing.cityInput);
      I.fillField(this.billing.cityInput, billingData.city);

      if (billingData.state) {
        I.selectOption(this.billing.stateSelect, billingData.state);
      }

      I.clearField(this.billing.zipInput);
      I.fillField(this.billing.zipInput, billingData.zip);

      if (billingData.country) {
        I.selectOption(this.billing.countrySelect, billingData.country);
      }

      if (billingData.phone) {
        I.clearField(this.billing.phoneInput);
        I.fillField(this.billing.phoneInput, billingData.phone);
      }
    } catch (error) {
      throw new Error(`Failed to fill billing information: ${error.message}`);
    }
  },
  // ===== PAYMENT METHODS =====

  // Payment Methods
  async selectPaymentMethod(method) {
    try {
      await I.waitForElement(this.payment.section);

      let paymentSelector;
      switch (method.toLowerCase()) {
        case this.PAYMENT_METHODS.CREDIT_CARD:
          paymentSelector = this.payment.creditCardOption;
          break;
        case this.PAYMENT_METHODS.PAYPAL:
          paymentSelector = this.payment.paypalOption;
          break;
        case this.PAYMENT_METHODS.APPLE_PAY:
          paymentSelector = this.payment.applePayOption;
          break;
        case this.PAYMENT_METHODS.GOOGLE_PAY:
          paymentSelector = this.payment.googlePayOption;
          break;
        case this.PAYMENT_METHODS.KLARNA:
          paymentSelector = this.payment.klarnaOption;
          break;
        case this.PAYMENT_METHODS.GIFT_CARD:
          paymentSelector = this.payment.giftCardOption;
          break;
        default:
          throw new Error(`Unknown payment method: ${method}`);
      }

      await I.waitForElement(paymentSelector);
      I.click(paymentSelector);
    } catch (error) {
      throw new Error(
        `Failed to select payment method "${method}": ${error.message}`
      );
    }
  },

  async fillCreditCardInformation(cardType, cardData) {
    try {
      if (!cardData[cardType]) {
        throw new Error(`Card data not found for type: ${cardType}`);
      }

      const card = cardData[cardType];
      await this.validateCardData(card);

      // Wait for payment frames to load
      await I.waitForElement(this.payment.cardNumberFrame);

      // Fill card number
      within({ frame: this.payment.cardNumberFrame }, () => {
        I.fillField(this.payment.cardNumberInput, card.number);
      });
      // Fill expiry date
      within({ frame: this.payment.expiryFrame }, () => {
        I.fillField(this.payment.expiryDateInput, card.expiryDate);
      });
      // Fill CVV
      within({ frame: this.payment.cvvFrame }, () => {
        I.fillField(this.payment.cvvInput, card.cvv);
      });

      // MORE EXPLICIT CONTEXT RESET
      I.switchTo(null); // Switch to main frame explicitly
      I.switchTo(); // Additional switchTo call
      // Fill cardholder name (outside iframe)
      I.clearField(this.payment.cardholderNameInput);
      I.fillField(this.payment.cardholderNameInput, card.cardholderName);
    } catch (error) {
      throw new Error(
        `Failed to fill credit card information: ${error.message}`
      );
    }
  },

  // ===== PROMO CODE METHODS =====

  async applyPromoCode(promoCode) {
    try {
      if (!promoCode || promoCode.trim() === "") {
        throw new Error("Promo code cannot be empty");
      }
      await I.waitForElement(this.promoCode.input);
      I.clearField(this.promoCode.input);
      I.fillField(this.promoCode.input, promoCode);
      I.click(this.promoCode.applyBtn);

      // Wait for promo code processing
      await I.waitForElement(this.promoCode.message);
    } catch (error) {
      throw new Error(
        `Failed to apply promo code "${promoCode}": ${error.message}`
      );
    }
  },

  async removePromoCode() {
    try {
      await I.waitForElement(this.promoCode.removeBtn);
      I.click(this.promoCode.removeBtn);
    } catch (error) {
      throw new Error(`Failed to remove promo code: ${error.message}`);
    }
  },

  // Agreement Methods

  async subscribeToNewsletter() {
    try {
      await I.waitForElement(this.agreements.newsletterCheckbox);
      I.checkOption(this.agreements.newsletterCheckbox);
    } catch (error) {
      throw new Error(`Failed to subscribe to newsletter: ${error.message}`);
    }
  },

  // ===== ORDER COMPLETION METHODS =====

  // Submit the order
  async submitOrder() {
    try {
      I.wait(3); // Need to improve this
      // Wait for iframe context to clear by checking main page elements
      await I.waitForElement(this.navigation.placeOrderBtn);

      // Ensure place order button is enabled
      //I.seeElement(this.navigation.placeOrderBtn + ":not([disabled])");
      I.click(this.navigation.placeOrderBtn);
    } catch (error) {
      throw new Error(`Failed to submit order: ${error.message}`);
    }
  },

  async submitOrderWithPayPal(credentials = {}) {
    try {
      // Use credentials from environment variables, fallback to defaults if not set
      const defaultCredentials = {
        email: process.env.PAYPAL_TEST_EMAIL,
        password: process.env.PAYPAL_TEST_PASSWORD,
      };

      const paypalCredentials = { ...defaultCredentials, ...credentials };

      // Wait for PayPal iframe
      await I.waitForElement(this.paypal.frame);

      // Click PayPal button in iframe
      I.wait(1);
      within({ frame: `${this.paypal.frame}.visible` }, () => {
        I.click(this.paypal.payButton);
      });

      // Wait for PayPal popup window
      I.waitForNumberOfTabs(2, 10);
      I.switchToNextTab();

      // Handle PayPal login
      await this._handlePayPalLogin(paypalCredentials);

      // Switch back to main window
      I.switchToPreviousTab();
    } catch (error) {
      throw new Error(`Failed to submit PayPal order: ${error.message}`);
    }
  },

  async _handlePayPalLogin(credentials) {
    try {
      // Enter email
      await I.waitForElement(this.paypal.emailInput);
      I.fillField(this.paypal.emailInput, credentials.email);
      I.click(this.paypal.nextBtn);

      // Enter password
      await I.waitForElement(this.paypal.passwordInput);
      I.fillField(this.paypal.passwordInput, credentials.password);
      I.click(this.paypal.loginBtn);

      // Complete payment
      await I.waitForElement(this.paypal.submitBtn);
      I.click(this.paypal.submitBtn);
    } catch (error) {
      throw new Error(`PayPal login failed: ${error.message}`);
    }
  },


  // Order Completion Methods
  async continueToNextStep() {
    try {
      await I.waitForElement(this.navigation.continueBtn);
      I.click(this.navigation.continueBtn);
    } catch (error) {
      throw new Error(`Failed to continue to next step: ${error.message}`);
    }
  },

  // Verification Methods
  async verifyOrderTotal(expectedTotal) {
    try {
      await I.waitForElement(this.orderSummary.totalAmount);
      I.see(expectedTotal, this.orderSummary.totalAmount);
    } catch (error) {
      throw new Error(`Order total verification failed: ${error.message}`);
    }
  },

  async verifyShippingCost(expectedCost) {
    try {
      await I.waitForElement(this.orderSummary.shippingAmount);
      I.see(expectedCost, this.orderSummary.shippingAmount);
    } catch (error) {
      throw new Error(`Shipping cost verification failed: ${error.message}`);
    }
  },

  async verifyPromoCodeApplied(discountAmount) {
    try {
      I.see("Promo code applied", this.promoCode.message);
      I.see(discountAmount, this.orderSummary.discountAmount);
    } catch (error) {
      throw new Error(`Promo code verification failed: ${error.message}`);
    }
  },

  async verifyValidationError(errorType) {
    try {
      let expectedMessage;
      switch (errorType.toLowerCase()) {
        case "required":
          expectedMessage = "This field is required";
          break;
        case "email":
          expectedMessage = "Please enter a valid email address";
          break;
        case "phone":
          expectedMessage = "Please enter a valid phone number";
          break;
        case "creditcard":
          expectedMessage = "Please enter a valid credit card number";
          break;
        case "zipcode":
          expectedMessage = "Please enter a valid ZIP code";
          break;
        default:
          throw new Error(`Unknown validation error type: ${errorType}`);
      }

      I.see(expectedMessage, this.messages.fieldError);
    } catch (error) {
      throw new Error(`Validation error verification failed: ${error.message}`);
    }
  },

  // Utility Methods
  validateShippingData(data) {
    const required = [
      "firstName",
      "lastName",
      "address",
      "city",
      "zip",
      "phone",
    ];
    for (const field of required) {
      if (!data[field]) {
        throw new Error(`Shipping ${field} is required`);
      }
    }

    if (data.email && !this._isValidEmail(data.email)) {
      throw new Error("Valid email is required");
    }
  },

  validateBillingData(data) {
    const required = ["firstName", "lastName", "address", "city", "zip"];
    for (const field of required) {
      if (!data[field]) {
        throw new Error(`Billing ${field} is required`);
      }
    }
  },

  validateCardData(card) {
    const required = ["number", "expiryDate", "cvv", "cardholderName"];
    for (const field of required) {
      if (!card[field]) {
        throw new Error(`Card ${field} is required`);
      }
    }
  },

  _isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  async _elementExists(selector) {
    try {
      const count = await I.grabNumberOfVisibleElements(selector);
      return count > 0;
    } catch (error) {
      return false;
    }
  },

  async verifyPageLoaded() {
    try {
      await I.waitForElement(this.shipping.section);
      I.seeElement(this.shipping.section);
    } catch (error) {
      throw new Error(`Checkout page not loaded properly: ${error.message}`);
    }
  },
};
