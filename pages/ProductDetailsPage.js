const { I } = inject();

/**
 * Product Details Page Object - Handles product detail page functionality
 */
module.exports = {
  // Organized locators by logical sections
  product: {
    title:
      '[data-testid="product-title"], h1[data-sentry-element="ProductName"]', // Need to imrove locator
    price: '[data-testid="product-price"], [data-sentry-element="Price"]', // Need to imrove locator
    description:
      '[data-sentry-component="AccordionProductDescription"] [data-sentry-element="AccordionContent"]',
    specification:
      '[data-sentry-component="AccordionProductSpecs"] [data-sentry-element="AccordionContent"]',
    images: '[data-sentry-component="ImageSalesforce"]',
  },

  actions: {
    addToCartBtn: 'button[data-sid^="pdp_addtocart"]',
    quantitySelector: 'button[data-sid^="pdp_quantity_selector"]',
    quantityInput: 'input[data-testid="quantity-input"]',
  },

  sections: {
    bazaarVoice: '[data-sentry-component="BazaarvoicePDPComponent"]',
    benefits: '[data-sentry-component="Benefits"]',
  },

  // Main Actions
  async addToCart(options = {}) {
    try {
      // Click add to cart
      await I.waitForElement(this.actions.addToCartBtn);
      I.click(this.actions.addToCartBtn);
    } catch (error) {
      throw new Error(`Failed to add product to cart: ${error.message}`);
    }
  },

  async verifyPageLoaded() {
    try {
      // Verify essential elements are present
      //await I.waitForElement(this.product.title);
      await I.waitForElement(
        this.actions.addToCartBtn
      );

      // Verify product information sections
      //I.seeElement(this.product.price);
      //I.seeElement(this.product.images);

      // Verify key components
      I.seeElement(this.sections.bazaarVoice);
    } catch (error) {
      throw new Error(
        `Product details page not loaded properly: ${error.message}`
      );
    }
  },
};
