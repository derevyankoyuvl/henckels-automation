const { I } = inject();

/**
 * Checkout Page Object - Handles checkout process and payment functionality
 */
module.exports = {
  // Guest locators
  guestSignUpBtn: '[data-sid="contact_register"]',
  guestLoginBtn: '[data-sid="contact_login"]',
  guestEmailInput: '[data-sid="contact_email"]',

  // Shipping locators
  shippingSection: '[data-sentry-component="ShippingAddressSection"]',
  shippingFirstNameInput:
    '[data-sentry-component="ShippingAddressSection"] #firstName',
  shippingLastNameInput:
    '[data-sentry-component="ShippingAddressSection"] #lastName',
  shippingAddressInput:
    '[data-sentry-component="ShippingAddressSection"] #address1',
  shippingAddress2Input:
    '[data-sentry-component="ShippingAddressSection"] #address2',
  shippingCityInput: '[data-sentry-component="ShippingAddressSection"] #city',
  shippingStateSelect:
    '[data-sentry-component="ShippingAddressSection"] button[aria-label="stateCode"]',
  shippingZipInput:
    '[data-sentry-component="ShippingAddressSection"] #postalCode',
  shippingCountrySelect:
    '[data-sentry-component="ShippingAddressSection"][data-sid="accountform_countrycode_1"]',
  shippingPhoneInput:
    '[data-sentry-component="ShippingAddressSection"] [name="phone"]',

  // Billing locators
  billingSection: '[data-sentry-component="BillingAddressSection"]',
  billingSameAsShippingCheckbox: '[data-sid="checkout_useshipping"]',
  billingFirstNameInput:
    '[data-sentry-component="BillingAddressSection"] #firstName',
  billingLastNameInput:
    '[data-sentry-component="BillingAddressSection"] #lastName',
  billingAddressInput:
    '[data-sentry-component="BillingAddressSection"] #address1',
  billingAddress2Input:
    '[data-sentry-component="BillingAddressSection"] #address2',
  billingCityInput: '[data-sentry-component="BillingAddressSection"] #city',
  billingStateSelect:
    '[data-sentry-component="BillingAddressSection"] button[aria-label="stateCode"]',
  billingZipInput:
    '[data-sentry-component="BillingAddressSection"] #postalCode',
  billingCountrySelect:
    '[data-sentry-component="BillingAddressSection"] button[aria-label="countryCode"]',
  billingPhoneCountrySelect:
    '[data-sentry-component="BillingAddressSection"] [data-sid="accountform_countrycode_1"]',
  billingPhoneInput:
    '[data-sentry-component="BillingAddressSection"] [name="phone"]',

  // Payment locators
  paymentSection: "#payment-section",
  paymentCreditCardOption: '[for="opt-scheme"]',
  paymentGiftCardOption: '[for="opt-giftcard"]',
  paymentGooglePayOption: '[for="opt-googlepay"]',
  paymentPaypalOption: '[for="opt-paypal"]',
  paymentApplePayOption: '[for="opt-applepay"]',
  paymentKlarnaOption: '[for="opt-klarna"]',
  paymentCardNumberFrame: '[title="Iframe for card number"]',
  paymentExpiryFrame: '[title="Iframe for expiry date"]',
  paymentCvvFrame: '[title="Iframe for security code"]',
  paymentCardNumberInput: "input[id^='adyen-checkout-encryptedCardNumber']",
  paymentExpiryDateInput: "input[id^='adyen-checkout-encryptedExpiryDate']",
  paymentCvvInput: "input[id^='adyen-checkout-encryptedSecurityCode']",
  paymentCardholderNameInput: 'input[name="holderName"]',

  // Order Summary locators
  orderSummarySection: '[data-sentry-element="Card"]',
  orderSummaryItemName: '[data-testid="order-item-name"]',
  orderSummaryItemPrice: '[data-testid="order-item-price"]',
  orderSummaryItemQuantity: '[data-testid="order-item-quantity"]',
  orderSummarySubtotalAmount: '[data-testid="order-subtotal"]',
  orderSummaryTaxAmount: '[data-testid="order-tax"]',
  orderSummaryShippingAmount: '[data-testid="order-shipping"]',
  orderSummaryDiscountAmount: '[data-testid="order-discount"]',
  orderSummaryTotalAmount: '[data-testid="order-total"]',

  // Promo Code locators
  promoCodeSection: '[data-sentry-component="PromoCode"]',
  promoCodeInput: '[data-sid="checkout_promocode_input"]',
  promoCodeApplyBtn: '[data-sid="checkout_promocode_apply"]',
  promoCodeMessage: '[data-testid="promo-message"]',
  promoCodeRemoveBtn: '[data-testid="remove-promo"]',

  // Agreements locators
  agreementsNewsletterCheckbox: "#newsSignUp-accept",
  agreementsTermsConditionsLnk: '#payment-section a[href*="terms"]',

  // Navigation locators
  navigationContinueBtn: '//button[contains(text(), "Save & Continue")]',
  navigationPlaceOrderBtn: "button[data-sid='checkout_paynow']",
  navigationEditEmail:
    '[data-sentry-component="ContactInfoCard"] [title="Edit customer information"]',
  navigationEditShippingBtn:
    '[data-sentry-component="ShippingAddressSection"] [title="Edit customer information"]',

  // PayPal locators
  paypalFrame: 'iframe[title="PayPal"]',
  paypalEmailInput: "#email",
  paypalPasswordInput: "#password",
  paypalNextBtn: "#btnNext",
  paypalLoginBtn: "#btnLogin",
  paypalSubmitBtn: 'button[data-testid="submit-button-initial"]',
  paypalPayButton: '[aria-label="PayPal"]',

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
    I.clearField(this.guestEmailInput);
    I.fillField(this.guestEmailInput, shippingData.email);
  },

  // Fill shipping information
  async fillShippingInformation(shippingData) {

    // Fill required fields
    I.clearField(this.shippingFirstNameInput);
    I.fillField(this.shippingFirstNameInput, shippingData.firstName);

    I.clearField(this.shippingLastNameInput);
    I.fillField(this.shippingLastNameInput, shippingData.lastName);

    I.clearField(this.shippingAddressInput);
    I.fillField(this.shippingAddressInput, shippingData.address);

    // Tab to trigger address validation
    I.pressKey("Tab");

    // Fill optional address line 2
    if (shippingData.address2) {
      I.clearField(this.shippingAddress2Input);
      I.fillField(this.shippingAddress2Input, shippingData.address2);
    }

    I.clearField(this.shippingCityInput);
    I.fillField(this.shippingCityInput, shippingData.city);

    I.click(this.shippingStateSelect);
    I.click(shippingData.state);

    I.clearField(this.shippingZipInput);
    I.fillField(this.shippingZipInput, shippingData.zip);

    I.clearField(this.shippingPhoneInput);
    I.fillField(this.shippingPhoneInput, shippingData.phone);
  },

  async editShippingAddress() {
    await I.waitForElement(this.navigationEditShippingBtn);
    I.click(this.navigationEditShippingBtn);
  },

  // ===== BILLING INFORMATION METHODS =====
  // Billing Information Methods
  async useSameAsShipping() {
    await I.waitForElement(this.billingSameAsShippingCheckbox);
    I.checkOption(this.billingSameAsShippingCheckbox);
  },

  async fillBillingInformation(billingData) {
    await this.validateBillingData(billingData);

    // Uncheck same as shipping first
    I.uncheckOption(this.billingSameAsShippingCheckbox);
    await I.waitForElement(this.billingFirstNameInput);

    I.clearField(this.billingFirstNameInput);
    I.fillField(this.billingFirstNameInput, billingData.firstName);

    I.clearField(this.billingLastNameInput);
    I.fillField(this.billingLastNameInput, billingData.lastName);

    I.clearField(this.billingAddressInput);
    I.fillField(this.billingAddressInput, billingData.address);

    if (billingData.address2) {
      I.clearField(this.billingAddress2Input);
      I.fillField(this.billingAddress2Input, billingData.address2);
    }

    I.clearField(this.billingCityInput);
    I.fillField(this.billingCityInput, billingData.city);
    I.selectOption(this.billingStateSelect, billingData.state);
    I.clearField(this.billingZipInput);
    I.fillField(this.billingZipInput, billingData.zip);
    I.selectOption(this.billingCountrySelect, billingData.country);
    I.clearField(this.billingPhoneInput);
    I.fillField(this.billingPhoneInput, billingData.phone);
  },

  // ===== PAYMENT METHODS =====

  // Payment Methods
  async selectPaymentMethod(method) {
    await I.waitForElement(this.paymentSection);

    let paymentSelector;
    switch (method.toLowerCase()) {
      case this.PAYMENT_METHODS.CREDIT_CARD:
        paymentSelector = this.paymentCreditCardOption;
        break;
      case this.PAYMENT_METHODS.PAYPAL:
        paymentSelector = this.paymentPaypalOption;
        break;
      case this.PAYMENT_METHODS.APPLE_PAY:
        paymentSelector = this.paymentApplePayOption;
        break;
      case this.PAYMENT_METHODS.GOOGLE_PAY:
        paymentSelector = this.paymentGooglePayOption;
        break;
      case this.PAYMENT_METHODS.KLARNA:
        paymentSelector = this.paymentKlarnaOption;
        break;
      case this.PAYMENT_METHODS.GIFT_CARD:
        paymentSelector = this.paymentGiftCardOption;
        break;
      default:
        throw new Error(`Unknown payment method: ${method}`);
    }

    await I.waitForElement(paymentSelector);
    I.click(paymentSelector);
  },

  async fillCreditCardInformation(cardType, cardData) {
    const card = cardData[cardType];

    // Wait for payment frames to load
    await I.waitForElement(this.paymentCardNumberFrame);

    // Fill card number
    within({ frame: this.paymentCardNumberFrame }, () => {
      I.fillField(this.paymentCardNumberInput, card.number);
    });
    // Fill expiry date
    within({ frame: this.paymentExpiryFrame }, () => {
      I.fillField(this.paymentExpiryDateInput, card.expiryDate);
    });
    // Fill CVV
    within({ frame: this.paymentCvvFrame }, () => {
      I.fillField(this.paymentCvvInput, card.cvv);
    });

    // MORE EXPLICIT CONTEXT RESET
    I.switchTo(null); // Switch to main frame explicitly
    I.switchTo(); // Additional switchTo call
    // Fill cardholder name (outside iframe)
    I.clearField(this.paymentCardholderNameInput);
    I.fillField(this.paymentCardholderNameInput, card.cardholderName);
  },

  // ===== PROMO CODE METHODS =====

  async applyPromoCode(promoCode) {
    await I.waitForElement(this.promoCodeInput);
    I.clearField(this.promoCodeInput);
    I.fillField(this.promoCodeInput, promoCode);
    I.click(this.promoCodeApplyBtn);

    // Wait for promo code processing
    await I.waitForElement(this.promoCodeMessage);
  },

  async removePromoCode() {
    await I.waitForElement(this.promoCodeRemoveBtn);
    I.click(this.promoCodeRemoveBtn);
  },

  // Agreement Methods

  async subscribeToNewsletter() {
    await I.waitForElement(this.agreementsNewsletterCheckbox);
    I.checkOption(this.agreementsNewsletterCheckbox);
  },

  // ===== ORDER COMPLETION METHODS =====

  // Submit the order
  async submitOrder() {
    I.wait(3); // Need to improve this
    // Wait for iframe context to clear by checking main page elements
    await I.waitForElement(this.navigationPlaceOrderBtn);

    // Ensure place order button is enabled
    //I.seeElement(this.navigationPlaceOrderBtn + ":not([disabled])");
    I.click(this.navigationPlaceOrderBtn);
  },

  async submitOrderWithPayPal(credentials = {}) {
    // Use credentials from environment variables, fallback to defaults if not set
    const defaultCredentials = {
      email: process.env.PAYPAL_TEST_EMAIL,
      password: process.env.PAYPAL_TEST_PASSWORD,
    };

    const paypalCredentials = { ...defaultCredentials, ...credentials };

    // Wait for PayPal iframe
    await I.waitForElement(this.paypalFrame);

    // Click PayPal button in iframe
    I.wait(1);
    within({ frame: `${this.paypalFrame}.visible` }, () => {
      I.click(this.paypalPayButton);
    });

    // Wait for PayPal popup window
    I.waitForNumberOfTabs(2, 10);
    I.switchToNextTab();

    // Handle PayPal login
    await this._handlePayPalLogin(paypalCredentials);

    // Switch back to main window
    I.switchToPreviousTab();
  },

  async _handlePayPalLogin(credentials) {
    // Enter email
    await I.waitForElement(this.paypalEmailInput);
    I.fillField(this.paypalEmailInput, credentials.email);
    I.click(this.paypalNextBtn);

    // Enter password
    await I.waitForElement(this.paypalPasswordInput);
    I.fillField(this.paypalPasswordInput, credentials.password);
    I.click(this.paypalLoginBtn);

    // Complete payment
    await I.waitForElement(this.paypalSubmitBtn);
    I.click(this.paypalSubmitBtn);
  },

  // Order Completion Methods
  async continueToNextStep() {
    await I.waitForElement(this.navigationContinueBtn);
    I.click(this.navigationContinueBtn);
  },

  // Verification Methods
  async verifyOrderTotal(expectedTotal) {
    await I.waitForElement(this.orderSummaryTotalAmount);
    I.see(expectedTotal, this.orderSummaryTotalAmount);
  },

  async verifyShippingCost(expectedCost) {
    await I.waitForElement(this.orderSummaryShippingAmount);
    I.see(expectedCost, this.orderSummaryShippingAmount);
  },

  async verifyPromoCodeApplied(discountAmount) {
    I.see("Promo code applied", this.promoCodeMessage);
    I.see(discountAmount, this.orderSummaryDiscountAmount);
  },

  async verifyPageLoaded() {
    await I.waitForElement(this.shippingSection);
    I.seeElement(this.shippingSection);
  },
};
