const { orderSummary } = require("./CheckoutPage");

const { I } = inject();

/**
 * Order Confirmation Page Object - Handles order confirmation and verification
 */
module.exports = {
  // Organized locators by logical sections
  thankYou: {
    section: "#orderconfirmation-content",
    title: "#orderconfirmation-content h1",
    message: "#orderconfirmation-content .bg-card h2",
  },

  orderDetails: {
    section: '[data-sentry-component="OrderDetails"]',
    title: '[data-sentry-component="OrderDetails"] h3',
    orderNumber: '[data-sentry-component="OrderDetails"]', // Need to improve locator
    orderDate: '[data-sentry-component="OrderDetails"]', // Need to improve locator
    orderStatus: '[data-sentry-component="OrderShippingStatus"]',
  },

  orderSummary: {
    container: '[data-testid="order-products"], .order-products', // Need to improve locator
    productItem: '[data-sentry-component="OrderItems"]',
    productName: '[data-sentry-component="OrderItems"]', // Need to improve locator
    productQuantity: '[data-sentry-component="OrderItems"]', // Need to improve locator
    productImage: '[data-sentry-component="OrderItems"]', // Need to improve locator
    productPrice: '[data-sentry-component="OrderPriceInfo"]',
    subtotal: '[data-sentry-component="OrderPriceInfo"]', // Need to improve locator
    tax: '[data-sentry-component="OrderPriceInfo"]', // Need to improve locator
    shipping: '[data-sentry-component="OrderPriceInfo"]', // Need to improve locator
    discount: '[data-sentry-component="OrderPriceInfo"]', // Need to improve locator
    total: '[data-sentry-component="OrderPriceInfo"]', // Need to improve locator
    promoCode: '[data-sentry-component="OrderPriceInfo"]', // Need to improve locator
  },

  addresses: {
    shippingSection: '[data-sentry-component="OrderAddressInfo"]', // Need to improve locator
    billingSection: '[data-sentry-component="OrderAddressInfo"]', // Need to improve locator
    customerName: '[data-sentry-component="OrderAddressInfo"]', // Need to improve locator
    streetAddress: '[data-sentry-component="OrderAddressInfo"]', // Need to improve locator
    cityStateZip: '[data-sentry-component="OrderAddressInfo"]', // Need to improve locator
    country: '[data-sentry-component="OrderAddressInfo"]', // Need to improve locator
    phoneNumber: '[data-sentry-component="OrderAddressInfo"]', // Need to improve locator
  },

  payment: {
    section: '[data-sentry-component="OrderPaymentInfo"]',
    method: '[data-sentry-component="OrderPaymentInfo"]', // Need to improve locator
    amount: '[data-sentry-component="OrderPaymentInfo"]', // Need to improve locator
  },

  actions: {
    continueShoppingButton: '[data-sid="checkout_continueshopping"]',
  },
  
  async verifyPageLoaded() {
    try {
      // Wait for essential sections to load
      await I.waitForElement(this.thankYou.section);
      await I.waitForElement(this.orderDetails.section);

      // Verify key components are present
      I.seeElement(this.thankYou.title);
    } catch (error) {
      throw new Error(
        `Confirmation page not loaded properly: ${error.message}`
      );
    }
  },

  // Thank You Message Verification
  async verifyThankYouMessage(customerName) {
    try {
      if (!customerName) {
        throw new Error("Customer name is required for verification");
      }

      // Wait for thank you message
      await I.waitForElement(this.thankYou.title);

      // Check for thank you message with customer name
      I.see(`Thank you, ${customerName}`, this.thankYou.title);

      // Verify confirmation text
      I.see(
        "We have received your order and will send an order confirmation",
        this.thankYou.message
      );

      // Check for spam folder note
      try {
        I.see(
          "If you don't see it, be sure to check your SPAM folder",
          this.thankYou.message
        );
      } catch (spamError) {
        console.log("Spam folder note not found (optional)");
      }
    } catch (error) {
      throw new Error(
        `Thank you message verification failed: ${error.message}`
      );
    }
  },

  async verifyOrderCompletion(customerName) {
    try {
      await this.verifyPageLoaded();
      await this.verifyThankYouMessage(customerName);
    } catch (error) {
      throw new Error(`Order completion verification failed: ${error.message}`);
    }
  },

  // Order Details Verification
  async verifyOrderDetails(expectedOrderData = {}) {
    try {
      I.seeElement(this.orderDetails.section);

      if (expectedOrderData.orderNumber) {
        I.see(expectedOrderData.orderNumber, this.orderDetails.orderNumber);
      }

      if (expectedOrderData.orderDate) {
        I.see(expectedOrderData.orderDate, this.orderDetails.orderDate);
      }

      if (expectedOrderData.status) {
        I.see(expectedOrderData.status, this.orderDetails.orderStatus);
      }
    } catch (error) {
      throw new Error(`Order details verification failed: ${error.message}`);
    }
  },

  async getOrderNumber() {
    try {
      await I.waitForElement(this.orderDetails.orderNumber);
      const orderNumber = await I.grabTextFrom(this.orderDetails.orderNumber);
      return orderNumber.trim();
    } catch (error) {
      throw new Error(`Failed to retrieve order number: ${error.message}`);
    }
  },

  async getOrderDate() {
    try {
      await I.waitForElement(this.orderDetails.orderDate);
      const orderDate = await I.grabTextFrom(this.orderDetails.orderDate);
      return orderDate.trim();
    } catch (error) {
      throw new Error(`Failed to retrieve order date: ${error.message}`);
    }
  },

  // Pricing Verification
  async verifyPricing(expectedPricing = {}) {
    try {
      await I.waitForElement(this.orderSummary.productPrice);

      if (expectedPricing.subtotal) {
        I.see(expectedPricing.subtotal, this.orderSummary.subtotal);
      }

      if (expectedPricing.tax) {
        I.see(expectedPricing.tax, this.orderSummary.tax);
      }

      if (expectedPricing.shipping) {
        I.see(expectedPricing.shipping, this.orderSummary.shipping);
      }

      if (expectedPricing.discount) {
        I.see(expectedPricing.discount, this.orderSummary.discount);
      }

      if (expectedPricing.total) {
        I.see(expectedPricing.total, this.orderSummary.total);
      }
    } catch (error) {
      throw new Error(`Pricing verification failed: ${error.message}`);
    }
  },

  async verifyPricingCalculation() {
    try {
      const subtotal = await this.extractPrice(this.orderSummary.subtotal);
      const tax = await this.extractPrice(this.orderSummary.tax);
      const shipping = await this.extractPrice(this.orderSummary.shipping);
      const total = await this.extractPrice(this.orderSummary.total);

      let discount = 0;
      try {
        discount = await this.extractPrice(this.orderSummary.discount);
      } catch (error) {
        console.log("No discount applied");
      }

      const calculatedTotal = subtotal + tax + shipping - discount;
      const tolerance = 0.01; // Allow for rounding differences

      if (Math.abs(total - calculatedTotal) > tolerance) {
        throw new Error(
          `Total price mismatch. Expected: ${calculatedTotal}, Actual: ${total}`
        );
      }

      console.log(`✅ Pricing calculation verified: $${total}`);
    } catch (error) {
      throw new Error(
        `Pricing calculation verification failed: ${error.message}`
      );
    }
  },
};
