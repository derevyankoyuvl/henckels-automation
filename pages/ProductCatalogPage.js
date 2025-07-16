const { I } = inject();

/**
 * Product Catalog Page Object - Handles product listing and catalog functionality
 */
module.exports = {
  // Containers locators
  productGrid: ".relative .grid",
  productCard: '[data-sentry-element="Card"]',
  breadcrumbs: '[data-sentry-element="BreadcrumbList"]',
  categoryHeader: '[data-testid="category-header"]',

  // Products locators
  productLink: '[data-sentry-element="Link"]',
  productTitle: '[data-testid="product-title"]',
  productPrice: '[data-testid="product-price"]',
  productImage: '[data-sentry-element="Image"]',
  productRating: '[itemprop="aggregateRating"]',
  addToCartBtn: "button[data-sid^='product_add_to_cart_item']",

  // Filters locators
  filterBtn: '[data-sid="filter_filter"]',
  filterPanel: '[data-sentry-element="SheetContent"]',
  closeFilterBtn: '[data-sid="close-button"]',
  clearAllFiltersBtn: '[data-sentry-element="Button"]',
  applyFiltersBtn: '[data-sid="filter_apply"]',

  // Sorting locators
  sortOptionsBtn: '[data-sid="filter_sort"]',
  sortByRecommended: '[data-sid="sort_recommended"]',
  sortByPriceLowToHigh: '[data-sid="sort_price_low_to_high"]',
  sortByPriceHighToLow: '[data-sid="sort_price_high_to_low"]',
  sortByAvailability: '[data-sid="sort_availability"]',

  // Pagination locators
  loadMoreBtn: '[aria-label="Load more products"]',
  pageNumbers: '[data-testid="page-number"]',

  // Search and Results Verification
  async verifySearchResults(searchValue) {
    // Wait a bit for search results to load
    await I.wait(2);

    // Check if we have search result cards
    const cardElements = await I.grabNumberOfVisibleElements(
      '[data-sentry-element="Card"]'
    );

    if (cardElements > 0) {
      // Results found - verify each card contains the search term
      for (let i = 1; i <= cardElements; i++) {
        const cardLocator = `(//div[@data-sentry-element="Card"])[${i}]`;

        // Get text and check if it contains the search term (case-insensitive)
        const cardText = await I.grabTextFrom(cardLocator);
        const searchTerm = searchValue; // Make this dynamic if needed
        const containsSearchTerm = cardText
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

        if (!containsSearchTerm) {
          throw new Error(
            `Card ${i} should contain "${searchTerm}" but contains: ${cardText}`
          );
        }
      }
    } else {
      // No results found - verify "No matches were found" messag
      I.see("No matches were found");
    }
  },

  // Get all available product items on the page
  async getAvailableProductItems() {
    const productItems = [];

    // Get all product elements
    const productTexts = await I.grabAttributeFromAll(
      this.addToCartBtn,
      "aria-label"
    );

    for (let i = 0; i < productTexts.length; i++) {
      let selectorProductName = productTexts[i]
        .replace("Add ", "")
        .replace("to cart", "")
        .trim();
      productItems.push({
        name: productTexts[i].replace("Add ", "").replace("to cart", "").trim(),
        selector: `//a[@data-sentry-element='Link' and contains(., '${selectorProductName}')]`,
        index: i,
      });
    }
    return productItems;
  },

  // Open the product details page
  async openProductDetailsPage(productIndex) {
    const products = await this.getAvailableProductItems();
    const firstProduct = products[productIndex];

    // Click using the selector
    I.click(firstProduct.selector);
    I.wait(2); // Wait for navigation
    return firstProduct;
  },

  async verifyPageLoaded() {
    await I.waitForElement(this.productGrid);
    I.seeElement(this.productGrid);
  },
};
