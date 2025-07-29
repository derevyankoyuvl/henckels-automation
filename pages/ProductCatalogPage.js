const { I } = inject()

/**
 * Product Catalog Page Object - Handles product listing and catalog functionality
 * Uses Locator Builder pattern for better maintainability
 */
class ProductCatalogPage {
  constructor() {
    // Container locators
    this.productGrid = locate(".relative .grid").as("Product Grid")
    this.productCard = locate('[data-sentry-element="Card"]').as("Product Card")
    this.breadcrumbs = locate('[data-sentry-element="BreadcrumbList"]').as("Breadcrumbs")
    this.categoryHeader = locate('[data-testid="category-header"]').as("Category Header")

    // Product item locators
    this.productLink = locate('[data-sentry-element="Link"]').as("Product Link")
    this.productTitle = locate('[data-testid="product-title"]').as("Product Title")
    this.productPrice = locate('[data-testid="product-price"]').as("Product Price")
    this.productImage = locate('[data-sentry-element="Image"]').as("Product Image")
    this.productRating = locate('[itemprop="aggregateRating"]').as("Product Rating")
    this.addToCartBtn = locate("button[data-sid^='product_add_to_cart_item']").as("Add To Cart Button")

    // Filter section locators
    this.filterBtn = locate('[data-sid="filter_filter"]').as("Filter Button")
    this.filterPanel = locate('[data-sentry-element="SheetContent"]').as("Filter Panel")
    this.closeFilterBtn = locate('[data-sid="close-button"]').as("Close Filter Button")
    this.clearAllFiltersBtn = locate('[data-sentry-element="Button"]').as("Clear All Filters Button")
    this.applyFiltersBtn = locate('[data-sid="filter_apply"]').as("Apply Filters Button")

    // Sorting locators
    this.sortOptionsBtn = locate('[data-sid="filter_sort"]').as("Sort Options Button")
    this.sortByRecommended = locate('[data-sid="sort_recommended"]').as("Sort By Recommended")
    this.sortByPriceLowToHigh = locate('[data-sid="sort_price_low_to_high"]').as("Sort By Price Low To High")
    this.sortByPriceHighToLow = locate('[data-sid="sort_price_high_to_low"]').as("Sort By Price High To Low")
    this.sortByAvailability = locate('[data-sid="sort_availability"]').as("Sort By Availability")

    // Pagination locators
    this.loadMoreBtn = locate('[aria-label="Load more products"]').as("Load More Button")
    this.pageNumbers = locate('[data-testid="page-number"]').as("Page Numbers")

    // No results locators
    this.noResultsMessage = locate("text").withText("No matches were found").as("No Results Message")

    // Dynamic locators
    this.productCardByIndex = (index) =>
      locate('[data-sentry-element="Card"]')
        .at(index)
        .as(`Product Card ${index}`)

    this.productLinkByName = (productName) =>
      locate('[data-sentry-element="Link"]')
        .withText(productName)
        .as(`${productName} Product Link`)

    this.filterOptionByName = (filterName) =>
      locate(`[data-testid="filter-${filterName.toLowerCase()}"]`)
        .as(`${filterName} Filter Option`)

    this.sortOptionByType = (sortType) =>
      locate(`[data-sid="sort_${sortType.toLowerCase().replace(/\s+/g, '_')}"]`)
        .as(`Sort By ${sortType}`)
  }

  // Page verification methods
  verifyPageLoaded() {
    I.waitForElement(this.productGrid)
    I.seeElement(this.productGrid)
  }

  verifyBreadcrumbs() {
    I.seeElement(this.breadcrumbs)
  }

  verifyCategoryHeader(expectedCategory) {
    I.waitForElement(this.categoryHeader)
    if (expectedCategory) {
      I.see(expectedCategory, this.categoryHeader)
    }
  }

  // Search and Results Verification
  async verifySearchResults(searchValue) {
    // Wait for search results to load
    I.wait(2)
    
    // Check if we have search result cards
    const cardElements = await I.grabNumberOfVisibleElements(this.productCard)
    
    if (cardElements > 0) {
      // Results found - verify each card contains the search term
      for (let i = 1; i <= cardElements; i++) {
        const cardLocator = this.productCardByIndex(i)
        
        // Get text and check if it contains the search term (case-insensitive)
        const cardText = await I.grabTextFrom(cardLocator)
        const searchTerm = searchValue
        const containsSearchTerm = cardText
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
        
        if (!containsSearchTerm) {
          throw new Error(
            `Card ${i} should contain "${searchTerm}" but contains: ${cardText}`
          )
        }
      }
    } else {
      // No results found - verify "No matches were found" message
      I.see("No matches were found");
    }
  }

  verifyNoSearchResults() {
    I.see(this.noResultsMessage)
  }

  // Product listing methods
  async getAvailableProductItems() {
    const productItems = []
    
    // Get all product elements
    const productTexts = await I.grabAttributeFromAll(
      this.addToCartBtn,
      "aria-label"
    )
    
    for (let i = 0; i < productTexts.length; i++) {
      const cleanProductName = productTexts[i]
        .replace("Add ", "")
        .replace("to cart", "")
        .trim()
      
      productItems.push({
        name: cleanProductName,
        selector: this.productLinkByName(cleanProductName),
        index: i,
      })
    }
    
    return productItems
  }

  async getProductCount() {
    I.waitForElement(this.productCard)
    const productCount = await I.grabNumberOfVisibleElements(this.productCard)
    return productCount
  }

  async getProductNames() {
    const productNames = await I.grabTextFromAll(this.productTitle)
    return productNames.map(name => name.trim())
  }

  async getProductPrices() {
    const productPrices = await I.grabTextFromAll(this.productPrice)
    return productPrices.map(price => price.trim())
  }

  // Product interaction methods
  async openProductDetailsPage(productIndex) {
    const products = await this.getAvailableProductItems()
    const selectedProduct = products[productIndex]
    
    // Click using the locator
    I.click(selectedProduct.selector)
    I.wait(2) // Wait for navigation
    
    return selectedProduct
  }

  openProductByName(productName) {
    const productLink = this.productLinkByName(productName)
    I.waitForElement(productLink)
    I.click(productLink)
  }

  addProductToCart(productIndex) {
    const addToCartButton = locate(this.addToCartBtn).at(productIndex + 1).as(`Add To Cart Button ${productIndex}`)
    I.waitForElement(addToCartButton)
    I.click(addToCartButton)
  }

  addProductToCartByName(productName) {
    const productSelector = locate(this.addToCartBtn)
      .withAttr("aria-label", new RegExp(`Add ${productName} to cart`, "i"))
      .as(`Add ${productName} To Cart Button`)
    
    I.waitForElement(productSelector)
    I.click(productSelector)
  }

  // Filter methods
  openFilters() {
    I.waitForElement(this.filterBtn)
    I.click(this.filterBtn)
    I.waitForElement(this.filterPanel)
  }

  closeFilters() {
    I.waitForElement(this.closeFilterBtn)
    I.click(this.closeFilterBtn)
  }

  clearAllFilters() {
    I.waitForElement(this.clearAllFiltersBtn)
    I.click(this.clearAllFiltersBtn)
  }

  applyFilters() {
    I.waitForElement(this.applyFiltersBtn)
    I.click(this.applyFiltersBtn)
  }

  selectFilter(filterName) {
    this.openFilters()
    
    const filterOption = this.filterOptionByName(filterName)
    I.waitForElement(filterOption)
    I.click(filterOption)
    
    this.applyFilters()
  }

  // Sorting methods
  openSortOptions() {
    I.waitForElement(this.sortOptionsBtn)
    I.click(this.sortOptionsBtn)
  }

  sortByRecommended() {
    this.openSortOptions()
    I.waitForElement(this.sortByRecommended)
    I.click(this.sortByRecommended)
  }

  sortByPriceLowToHigh() {
    this.openSortOptions()
    I.waitForElement(this.sortByPriceLowToHigh)
    I.click(this.sortByPriceLowToHigh)
  }

  sortByPriceHighToLow() {
    this.openSortOptions()
    I.waitForElement(this.sortByPriceHighToLow)
    I.click(this.sortByPriceHighToLow)
  }

  sortByAvailability() {
    this.openSortOptions()
    I.waitForElement(this.sortByAvailability)
    I.click(this.sortByAvailability)
  }

  sortBy(sortType) {
    this.openSortOptions()
    
    const sortOption = this.sortOptionByType(sortType)
    I.waitForElement(sortOption)
    I.click(sortOption)
  }

  // Pagination methods
  loadMoreProducts() {
    I.waitForElement(this.loadMoreBtn)
    I.click(this.loadMoreBtn)
    I.wait(2) // Wait for new products to load
  }

  navigateToPage(pageNumber) {
    const pageLink = locate(this.pageNumbers).withText(pageNumber.toString()).as(`Page ${pageNumber}`)
    I.waitForElement(pageLink)
    I.click(pageLink)
  }

  // Product verification methods
  verifyProductExists(productName) {
    const productLink = this.productLinkByName(productName)
    I.seeElement(productLink)
  }

  verifyProductNotExists(productName) {
    const productLink = this.productLinkByName(productName)
    I.dontSeeElement(productLink)
  }

  // Advanced verification methods
  verifyProductGridLayout() {
    I.seeElement(this.productGrid)
    I.seeElement(this.productCard)
  }
}

module.exports = new ProductCatalogPage()