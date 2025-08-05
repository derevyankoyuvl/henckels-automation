const { I } = inject()

/**
 * Product Details Page Object - Handles product detail page functionality
 * Uses Locator Builder pattern for better maintainability
 */
class ProductDetailsPage {
  constructor() {
    // Product information locators
    this.productTitle = locate('[data-testid="product-title"], h1[data-sentry-element="ProductName"]').as('Product Title')
    this.productPrice = locate('[data-testid="product-price"], [data-sentry-element="Price"]').as('Product Price')
    this.productImages = locate('[data-sentry-component="ImageSalesforce"]').as('Product Images')
    
    // Product description section locators
    this.descriptionSection = locate('[data-sentry-component="AccordionProductDescription"]').as('Description Section')
    this.productDescription = locate('[data-sentry-element="AccordionContent"]')
      .inside(this.descriptionSection)
      .as('Product Description')
    
    // Product specifications section locators
    this.specificationSection = locate('[data-sentry-component="AccordionProductSpecs"]').as('Specification Section')
    this.productSpecification = locate('[data-sentry-element="AccordionContent"]')
      .inside(this.specificationSection)
      .as('Product Specification')

    // Actions section locators
    this.actionsAddToCartBtn = locate('button[data-sid^="pdp_addtocart"]').as('Add To Cart Button')
    this.actionsQuantitySelector = locate('button[data-sid^="pdp_quantity_selector"]').as('Quantity Selector')
    
    // Additional action buttons
    this.wishlistBtn = locate('button[data-sid^="pdp_wishlist"]').as('Add To Wishlist Button')
    this.shareBtn = locate('button[data-sid^="pdp_share"]').as('Share Button')

    // Review and rating section locators
    this.sectionsBazaarVoice = locate('[data-sentry-component="BazaarvoicePDPComponent"]').as('Reviews Section')
    this.productRating = locate('[data-testid="product-rating"]').as('Product Rating')
    this.reviewsCount = locate('[data-testid="reviews-count"]').as('Reviews Count')

    // Additional sections locators
    this.sectionsBenefits = locate('[data-sentry-component="Benefits"]').as('Benefits Section')
    this.sectionsRecommendations = locate('[data-sentry-component="Recommendations"]').as('Recommendations Section')
    this.sectionsRecentlyViewed = locate('[data-sentry-component="RecentlyViewed"]').as('Recently Viewed Section')

    // Product details accordion locators
    this.descriptionAccordion = locate('[data-sentry-component="AccordionProductDescription"]').as('Description Accordion')
    this.specificationAccordion = locate('[data-sentry-component="AccordionProductSpecs"]').as('Specification Accordion')
    this.careInstructionsAccordion = locate('[data-sentry-component="AccordionCareInstructions"]').as('Care Instructions Accordion')
  }

  // Main Actions
  addToCart(options = {}) {
    I.waitForElement(this.actionsAddToCartBtn)
    I.click(this.actionsAddToCartBtn)
  }

  // Product information methods
  async getProductTitle() {
    I.waitForElement(this.productTitle)
    const title = await I.grabTextFrom(this.productTitle)
    return title.trim()
  }

  async getProductPrice() {
    I.waitForElement(this.productPrice)
    const price = await I.grabTextFrom(this.productPrice)
    return price.trim()
  }

  async getProductDescription() {
    I.waitForElement(this.productDescription)
    const description = await I.grabTextFrom(this.productDescription)
    return description.trim()
  }

  async getProductSpecification() {
    I.waitForElement(this.productSpecification)
    const specification = await I.grabTextFrom(this.productSpecification)
    return specification.trim()
  }

  // Wishlist and sharing methods
  addToWishlist() {
    I.waitForElement(this.wishlistBtn)
    I.click(this.wishlistBtn)
  }

  shareProduct() {
    I.waitForElement(this.shareBtn)
    I.click(this.shareBtn)
  }

  // Page verification methods
  verifyPageLoaded() {
    // Verify essential elements are present
    I.waitForElement(this.actionsAddToCartBtn)
    // I.seeElement(this.productTitle)
    // I.seeElement(this.productPrice)
    // I.seeElement(this.productImages)
    const isUS = process.env.COUNTRY === "us"
    if (isUS) {
      // Verify Bazar Voice component
      I.seeElement(this.sectionsBazaarVoice)
    }
  }
}

module.exports = new ProductDetailsPage()