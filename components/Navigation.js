const { I } = inject()

/**
 * Navigation Component - Handles header and footer navigation elements
 * Uses Locator Builder pattern for better maintainability
 */
class Navigation {
  constructor() {
    // Header structure locators
    this.navigation = locate("header.sticky").as("Main Navigation Header")
    this.skipToMain = locate("#uw-skip-to-main").as("Skip To Main Link")
    this.openNav = locate(
      "header button[data-sentry-source-file='navigation-sheet.tsx']"
    ).as("Open Navigation Menu")
    this.logo = locate('a[data-sid="menu_logohome"]').as("Logo Home Link")

    // Desktop navigation locators
    this.categoryLinks = locate("li a")
      .inside(this.navigation)
      .as("Category Links")
    this.openNavBtn = locate(
      'button[data-sentry-source-file="navigation-sheet.tsx"]'
    )
      .inside("header")
      .as("Open Navigation Button")

    // Mobile navigation locators
    this.mobileCategoryLinks = locate("nav .items-center span").as(
      "Mobile Category Links"
    )
    this.mobileSubCategoryLinks = locate("nav a span").as(
      "Mobile Sub Category Links"
    )

    // Search functionality locators
    this.searchButton = locate('button[data-sid="menu_quicksearch"]').as(
      "Search Button"
    )
    this.searchDialog = locate('[role="dialog"]').as("Search Dialog")
    this.searchInput = locate('input[data-sid="menu_search_input"]').as(
      "Search Input"
    )

    // Account functionality locators
    this.accountMenu = locate('button[data-sid="menu_account"]').as(
      "Account Menu Button"
    )
    this.signInLink = locate('a[data-sid="menu_signin"]').as("Sign In Link")
    this.signUpLink = locate('a[data-sid="menu_register"]').as("Sign Up Link")
    this.accountMenuTitle = locate("h1")
      .withText("CREATE AN ACCOUNT")
      .as("Account Menu Title")

    // Cart functionality
    this.cartIcon = locate('button[data-sid="menu_cart"]').as("Cart Icon")

    // Footer locators
    this.footerRoot = locate("#reduced-footer").as("Footer Root")
    this.contactLink = locate("a")
      .withText("Contact us here!")
      .as("Contact Link")
    this.shippingInfoLink = locate("a")
      .withText("Shipping Information")
      .as("Shipping Info Link")
    this.accessibilityWidget = locate("#userway_widget_trigger").as(
      "Accessibility Widget"
    )

    // Dynamic locators
    this.categoryLinkByName = (categoryName) =>
      locate("a")
        .withText(categoryName)
        .inside(this.navigation)
        .as(`${categoryName} Category Link`)

    this.mobileCategoryByName = (categoryName) =>
      locate("span")
        .withText(categoryName)
        .inside("nav .items-center")
        .as(`${categoryName} Mobile Category`)
  }

  // Account Management Methods
  openAccountMenu() {
    I.waitForElement(this.accountMenu)
    I.click(this.accountMenu)
  }

  openSignUpPage() {
    this.openAccountMenu()
    I.waitForElement(this.signUpLink)
    I.click(this.signUpLink)
    I.waitForElement(this.accountMenuTitle)
  }

  openSignInPage() {
    this.openAccountMenu()
    I.waitForElement(this.signInLink)
    I.click(this.signInLink)
  }

  // Search Methods
  openSearchDialog() {
    I.waitForElement(this.searchButton)
    I.click(this.searchButton)
    I.waitForElement(this.searchDialog)
  }

  enterSearchQuery(query) {
    I.waitForElement(this.searchInput)
    I.fillField(this.searchInput, query)
    I.pressKey("Enter")
  }

  performSearch(query) {
    this.openSearchDialog()
    this.enterSearchQuery(query)
  }

  searchAndVerifyResults(query) {
    this.performSearch(query)

    // Local timeout variable instead of global constant
    const searchResultsTimeout = 5
    I.wait(searchResultsTimeout)
  }

  // Utility Methods
  toTitleCase(str) {
    if (!str) {
      return ""
    }
    return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())
  }

  // Category Navigation Methods
  async getAvailableCategoriesFromHeader() {
    const categories = []

    const categoryTexts = await I.grabTextFromAll(this.categoryLinks)
    const categoryHrefs = await I.grabAttributeFromAll(
      this.categoryLinks,
      "href"
    )

    for (let i = 0; i < categoryTexts.length; i++) {
      const categoryName = categoryTexts[i].trim()
      const titleCaseName = this.toTitleCase(categoryName)

      categories.push({
        name: categoryName,
        url: categoryHrefs[i],
        selector: this.mobileCategoryByName(titleCaseName),
        index: i,
      })
    }

    return categories
  }

  async getAvailableMobileCategories() {
    // First open mobile navigation
    this.openMobileNavigation()

    const categories = []
    const categoryTexts = await I.grabTextFromAll(this.mobileCategoryLinks)

    for (let i = 0; i < categoryTexts.length; i++) {
      categories.push({
        name: categoryTexts[i].trim(),
        index: i,
        selector: locate(this.mobileCategoryLinks)
          .at(i + 1)
          .as(`Mobile Category ${i + 1}`),
      })
    }

    return categories
  }

  openMobileNavigation() {
    I.waitForElement(this.openNavBtn)
    I.click(this.openNavBtn)
    I.waitForElement(this.mobileCategoryLinks)
  }

  closeMobileNavigation() {
    // Try to find and click close button
    const closeBtn = locate('button[aria-label="Close navigation"]').as(
      "Close Navigation Button"
    )

    try {
      I.click(closeBtn)
    } catch (error) {
      // Alternative: click outside the navigation
      I.click(this.navigation)
    }
  }

  async openCategory(categoryIndex) {
    const isMobile = process.env.SCREEN_SIZE === "mobile"
    if (isMobile) {
      I.click(this.openNav)
      I.waitForElement(this.mobileCategoryLinks)
      const categories = await I.grabTextFromAll(this.mobileCategoryLinks)
      const category = categories[categoryIndex]
      I.click(locate(this.mobileCategoryLinks).at(categoryIndex + 1))
      //I.click(category);
      I.wait(2) // Wait for navigation
      I.waitForElement(this.mobileSubCategoryLinks)
      const subCategories = await I.grabTextFromAll(this.mobileSubCategoryLinks)
      I.click(locate(this.mobileSubCategoryLinks).at(1)) // Click the first subcategory
      I.wait(2) // Wait for navigation
      return
    } else {
      const categories = await this.getAvailableCategoriesFromHeader()
      const category = categories[categoryIndex]
      I.click(category.selector)
      I.wait(2) // Wait for navigation
      return category
    }
  }

  async isCategoryAvailable(categoryName) {
    const categories = await this.getAvailableCategoriesFromHeader()
    return categories.some((cat) =>
      cat.name.toLowerCase().includes(categoryName.toLowerCase())
    )
  }

  async openCategoryByName(categoryName, isMobile = false) {
    if (isMobile) {
      return this.openMobileCategoryByName(categoryName)
    } else {
      return this.openDesktopCategoryByName(categoryName)
    }
  }

  async openDesktopCategoryByName(categoryName) {
    const categories = await this.getAvailableCategoriesFromHeader()
    const targetCategory = categories.find((cat) =>
      cat.name.toLowerCase().includes(categoryName.toLowerCase())
    )

    if (!targetCategory) {
      throw new Error(`Category "${categoryName}" not found`)
    }

    return this.openCategory(targetCategory.index, false)
  }

  async openMobileCategoryByName(categoryName) {
    const categories = await this.getAvailableMobileCategories()
    const targetCategory = categories.find((cat) =>
      cat.name.toLowerCase().includes(categoryName.toLowerCase())
    )

    if (!targetCategory) {
      throw new Error(`Mobile category "${categoryName}" not found`)
    }

    return this.openCategory(targetCategory.index, true)
  }

  // Cart functionality
  openCart() {
    I.waitForElement(this.cartIcon)
    I.click(this.cartIcon)
  }

  async getCartItemCount() {
    try {
      const cartBadge = locate('[data-testid="cart-badge"]').as("Cart Badge")
      I.waitForElement(cartBadge)
      const count = await I.grabTextFrom(cartBadge)
      return parseInt(count) || 0
    } catch (error) {
      return 0 // No items in cart
    }
  }

  // Logo functionality
  clickLogo() {
    I.waitForElement(this.logo)
    I.click(this.logo)
  }

  // Footer functionality
  openContactPage() {
    I.scrollTo(this.footerRoot)
    I.waitForElement(this.contactLink)
    I.click(this.contactLink)
  }

  openShippingInfo() {
    I.scrollTo(this.footerRoot)
    I.waitForElement(this.shippingInfoLink)
    I.click(this.shippingInfoLink)
  }

  openAccessibilityWidget() {
    I.waitForElement(this.accessibilityWidget)
    I.click(this.accessibilityWidget)
  }

  // Verification methods
  verifyHeaderLoaded() {
    I.seeElement(this.navigation)
    I.seeElement(this.logo)
    I.seeElement(this.searchButton)
    I.seeElement(this.accountMenu)
    I.seeElement(this.cartIcon)
  }

  verifyFooterLoaded() {
    I.seeElement(this.footerRoot)
    I.seeElement(this.contactLink)
    I.seeElement(this.shippingInfoLink)
  }

  verifyNavigationElements() {
    this.verifyHeaderLoaded()
    this.verifyFooterLoaded()
  }

  verifyMobileNavigation() {
    I.seeElement(this.openNavBtn)

    this.openMobileNavigation()
    I.seeElement(this.mobileCategoryLinks)

    this.closeMobileNavigation()
  }

  verifySearchFunctionality() {
    I.seeElement(this.searchButton)

    this.openSearchDialog()
    I.seeElement(this.searchDialog)
    I.seeElement(this.searchInput)
  }

  verifyAccountMenu() {
    I.seeElement(this.accountMenu)

    this.openAccountMenu()
    I.seeElement(this.signInLink)
    I.seeElement(this.signUpLink)
  }
}

module.exports = new Navigation()
