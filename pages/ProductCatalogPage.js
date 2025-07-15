const { I } = inject();

/**
 * Product Catalog Page Object - Handles product listing and catalog functionality
 */
module.exports = {
  // Organized locators by logical sections
  containers: {
    productGrid: ".relative .grid",
    productCard: '[data-sentry-element="Card"]',
    breadcrumbs: '[data-sentry-element="BreadcrumbList"]',
    categoryHeader: '[data-testid="category-header"]', // Need to imrove locator
  },

  products: {
    productLink: '[data-sentry-element="Link"]',
    productTitle: '[data-testid="product-title"]', // Need to imrove locator
    productPrice: '[data-testid="product-price"]', // Need to imrove locator
    productImage: '[data-sentry-element="Image"]',
    productRating: '[itemprop="aggregateRating"]',
    addToCartBtn: "button[data-sid^='product_add_to_cart_item']",
  },

  filters: {
    filterBtn: '[data-sid="filter_filter"]',
    filterPanel: '[data-sentry-element="SheetContent"]',
    closeFilterBtn: '[data-sid="close-button"]',
    clearAllFiltersBtn: '[data-sentry-element="Button"]', // Need to imrove locator
    applyFiltersBtn: '[data-sid="filter_apply"]',
  },

  sorting: {
    sortOptionsBtn: '[data-sid="filter_sort"]',
    sortByRecommended: '[data-sid="sort_recommended"]',
    sortByPriceLowToHigh: '[data-sid="sort_price_low_to_high"]',
    sortByPriceHighToLow: '[data-sid="sort_price_high_to_low"]',
    sortByAvailability: '[data-sid="sort_availability"]',
  },

  pagination: {
    loadMoreBtn: '[aria-label="Load more products"]',
    pageNumbers: '[data-testid="page-number"]', // Need to imrove locator
  },

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
      console.log(`Found ${cardElements} search result cards`);

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

        console.log(`Card ${i} contains "${searchTerm}": "${cardText}" ✓`);
      }

      console.log(`All ${cardElements} cards contain the search term`);
    } else {
      // No results found - verify "No matches were found" message
      console.log(
        "No search result cards found, checking for 'No matches were found' message"
      );

      I.see("No matches were found");
      console.log("'No matches were found' message is displayed ✓");
    }
  },

  // Get all available product items on the page
  async getAvailableProductItems() {
    const productItems = [];

    try {
      // Get all product elements
      const productTexts = await I.grabAttributeFromAll(
        this.products.addToCartBtn,
        "aria-label"
      );

      for (let i = 0; i < productTexts.length; i++) {
        let selectorProductName = productTexts[i]
          .replace("Add ", "")
          .replace("to cart", "")
          .trim();
        productItems.push({
          name: productTexts[i]
            .replace("Add ", "")
            .replace("to cart", "")
            .trim(),
          selector: `//a[@data-sentry-element='Link' and contains(., '${selectorProductName}')]`,
          index: i,
        });
      }
      return productItems;
    } catch (error) {
      console.log("❌ Error getting products:", error.message);
      return [];
    }
  },

  // Open the product details page
  async openProductDetailsPage(productIndex) {
    try {
      const products = await this.getAvailableProductItems();

      if (products.length === 0) {
        console.log("⚠️ No products available to click");
        return null;
      }

      const firstProduct = products[productIndex];
      //console.log(`🔍 Clicking on first product: ${firstProduct.name}`);

      // Click using the selector
      I.click(firstProduct.selector);
      I.wait(2); // Wait for navigation

      //console.log(`✅ Successfully clicked on ${firstProduct.name}`);
      return firstProduct;
    } catch (error) {
      //console.log(`❌ Error clicking first product: ${error.message}`);
      return null;
    }
  },

  async verifyPageLoaded() {
    try {
      await I.waitForElement(this.containers.productGrid);
      I.seeElement(this.containers.productGrid);
    } catch (error) {
      throw new Error(
        `Product catalog page not loaded properly: ${error.message}`
      );
    }
  },
};
