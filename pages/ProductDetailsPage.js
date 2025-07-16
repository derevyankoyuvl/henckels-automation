const { I } = inject();

/**
 * Product Details Page Object - Handles product detail page functionality
 */
module.exports = {
  // Product locators
  productTitle:
    '[data-testid="product-title"], h1[data-sentry-element="ProductName"]',
  productPrice: '[data-testid="product-price"], [data-sentry-element="Price"]',
  productDescription:
    '[data-sentry-component="AccordionProductDescription"] [data-sentry-element="AccordionContent"]',
  productSpecification:
    '[data-sentry-component="AccordionProductSpecs"] [data-sentry-element="AccordionContent"]',
  productImages: '[data-sentry-component="ImageSalesforce"]',

  // Actions locators
  actionsAddToCartBtn: 'button[data-sid^="pdp_addtocart"]',
  actionsQuantitySelector: 'button[data-sid^="pdp_quantity_selector"]',
  actionsQuantityInput: 'input[data-testid="quantity-input"]',

  // Sections locators
  sectionsBazaarVoice: '[data-sentry-component="BazaarvoicePDPComponent"]',
  sectionsBenefits: '[data-sentry-component="Benefits"]',

  // Main Actions
  async addToCart(options = {}) {
    // Click add to cart
    await I.waitForElement(this.actionsAddToCartBtn);
    I.click(this.actionsAddToCartBtn);
  },

  async verifyPageLoaded() {
    // Verify essential elements are present
    //await I.waitForElement(this.productTitle);
    await I.waitForElement(this.actionsAddToCartBtn);

    // Verify product information sections
    //I.seeElement(this.productPrice);
    //I.seeElement(this.productImages);

    // Verify key components
    I.seeElement(this.sectionsBazaarVoice);
  },
};
