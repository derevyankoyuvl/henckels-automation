const { orderSummary } = require("./CheckoutPage");

const { I } = inject();
const { expect } = require("@playwright/test");

/**
 * Order Confirmation Page Object - Handles order confirmation and verification
 */
module.exports = {
  // Thank You locators
  thankYouSection: "#orderconfirmation-content",
  thankYouTitle: "#orderconfirmation-content h1",
  thankYouMessage: "#orderconfirmation-content .bg-card h2",

  // Order Details locators
  orderDetailsSection: '[data-sentry-component="OrderDetails"]',
  orderDetailsTitle: '[data-sentry-component="OrderDetails"] h3',
  orderDetailsNumber: '[data-sentry-component="OrderDetails"]',
  orderDetailsDate: '[data-sentry-component="OrderDetails"]',
  orderDetailsStatus: '[data-sentry-component="OrderShippingStatus"]',

  // Order Summary locators
  orderSummaryContainer: '[data-testid="order-products"], .order-products',
  orderSummaryProductItem: '[data-sentry-component="OrderItems"]',
  orderSummaryProductName: '[data-sentry-component="OrderItems"]',
  orderSummaryProductQuantity: '[data-sentry-component="OrderItems"]',
  orderSummaryProductImage: '[data-sentry-component="OrderItems"]',
  orderSummaryProductPrice: '[data-sentry-component="OrderPriceInfo"]',
  orderSummarySubtotal: '[data-sentry-component="OrderPriceInfo"]',
  orderSummaryTax: '[data-sentry-component="OrderPriceInfo"]',
  orderSummaryShipping: '[data-sentry-component="OrderPriceInfo"]',
  orderSummaryDiscount: '[data-sentry-component="OrderPriceInfo"]',
  orderSummaryTotal: '[data-sentry-component="OrderPriceInfo"]',
  orderSummaryPromoCode: '[data-sentry-component="OrderPriceInfo"]',

  // Addresses locators
  addressesShippingSection: '[data-sentry-component="OrderAddressInfo"]',
  addressesBillingSection: '[data-sentry-component="OrderAddressInfo"]',
  addressesCustomerName: '[data-sentry-component="OrderAddressInfo"]',
  addressesStreetAddress: '[data-sentry-component="OrderAddressInfo"]',
  addressesCityStateZip: '[data-sentry-component="OrderAddressInfo"]',
  addressesCountry: '[data-sentry-component="OrderAddressInfo"]',
  addressesPhoneNumber: '[data-sentry-component="OrderAddressInfo"]',

  // Payment locators
  paymentSection: '[data-sentry-component="OrderPaymentInfo"]',
  paymentMethod: '[data-sentry-component="OrderPaymentInfo"]',
  paymentAmount: '[data-sentry-component="OrderPaymentInfo"]',

  // Actions locators
  actionsContinueShoppingButton: '[data-sid="checkout_continueshopping"]',

  async verifyPageLoaded() {
    // Wait for essential sections to load
    await I.waitForElement(this.thankYouSection);
    await I.waitForElement(this.orderDetailsSection);

    // Verify key components are present
    I.seeElement(this.thankYouTitle);
  },

  // Thank You Message Verification
  async verifyThankYouMessage(customerName) {
    // Wait for thank you message
    await I.waitForElement(this.thankYouTitle);

    // Check for thank you message with customer name
    I.see(`Thank you, ${customerName}`, this.thankYouTitle);

    // Verify confirmation text
    I.see(
      "We have received your order and will send an order confirmation",
      this.thankYouMessage
    );
    I.see(
      "If you don't see it, be sure to check your SPAM folder",
      this.thankYouMessage
    );
  },

  async verifyOrderCompletion(customerName) {
    await this.verifyPageLoaded();
    await this.verifyThankYouMessage(customerName);
  },

  // Order Details Verification
  async verifyOrderDetails(expectedOrderData = {}) {
    I.seeElement(this.orderDetailsSection);
      I.see(expectedOrderData.orderNumber, this.orderDetailsNumber);
      I.see(expectedOrderData.orderDate, this.orderDetailsDate);
      I.see(expectedOrderData.status, this.orderDetailsStatus);
  },

  async getOrderNumber() {
    await I.waitForElement(this.orderDetailsNumber);
    const orderNumber = await I.grabTextFrom(this.orderDetailsNumber);
    return orderNumber.trim();
  },

  async getOrderDate() {
    await I.waitForElement(this.orderDetailsDate);
    const orderDate = await I.grabTextFrom(this.orderDetailsDate);
    return orderDate.trim();
  },

  // Pricing Verification
  async verifyPricing(expectedPricing = {}) {
    await I.waitForElement(this.orderSummaryProductPrice);
      I.see(expectedPricing.subtotal, this.orderSummarySubtotal);
      I.see(expectedPricing.tax, this.orderSummaryTax);
      I.see(expectedPricing.shipping, this.orderSummaryShipping);
      I.see(expectedPricing.discount, this.orderSummaryDiscount);
      I.see(expectedPricing.total, this.orderSummaryTotal);
  },

  async verifyPricingCalculation() {
    const subtotal = await this.extractPrice(this.orderSummarySubtotal);
    const tax = await this.extractPrice(this.orderSummaryTax);
    const shipping = await this.extractPrice(this.orderSummaryShipping);
    const total = await this.extractPrice(this.orderSummaryTotal);

    let discount = 0;
    discount = await this.extractPrice(this.orderSummaryDiscount);

    const calculatedTotal = subtotal + tax + shipping - discount;
    const tolerance = 0.01; // Allow for rounding differences
    expect(total).toBeCloseTo(calculatedTotal, 2);
  },
};
