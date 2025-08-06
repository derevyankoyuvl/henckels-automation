const { I } = inject()

/**
 * Home Page Object - Handles homepage functionality and navigation
 * Represents the main landing page for Henckels US website
 * Uses Locator Builder pattern for better maintainability
 */
class HomePage {
  constructor() {
    // Header locators
    this.navigation = locate("header.sticky").as("Main Navigation")
    this.logo = locate('a[data-sid="menu_logohome"]').as("Logo Home Link")

    // Shop by Category locators
    this.knives = locate('a[data-sid*="/knives"]').as("Knives Category Link")
    this.knifeSets = locate('a[data-sid*="/knife-set"]').as("Knife Sets Category Link")
    this.cookware = locate('a[data-sid*="/cookware"]').as("Cookware Category Link")
    this.kitchenTools = locate('a[data-sid*="/tools-accessories"]').as("Kitchen Tools Category Link")
    this.flatware = locate('a[data-sid*="/flatware"]').as("Flatware Category Link")
    this.sale = locate('a[data-sid*="/sale"]').as("Sale Category Link")

    // Hero Section locators
    this.heroCarousel = locate('[data-sentry-component="HeroCarousel"]').as("Hero Carousel")
    this.prevSlide = locate('button[data-sid="home_hero_previous_slide"]').as("Previous Slide Button")
    this.nextSlide = locate('button[data-sid="home_hero_next_slide"]').as("Next Slide Button")

    // Footer locators
    this.footerRoot = locate("#reduced-footer").as("Footer Root")

    // Gift Cards Section locators
    this.giftCardsContainer = locate('[data-sentry-component="DefaultVariation"]').as("Gift Cards Container")
    this.giftCardsTitle = locate("h3").inside(this.giftCardsContainer).as("Gift Cards Title")
    this.giftCardsDescription = locate("p").inside(this.giftCardsContainer).as("Gift Cards Description")
    this.getYoursButton = locate('[data-sid="home_hero_button_get_yours_now"]').as("Get Yours Button")
    this.brandLogos = locate('img[alt="GIFT CARDS"]').as("Gift Cards Brand Logo")

    // Dynamic locators for navigation
    this.categoryLinkByName = (categoryName) =>
      locate(`a[data-sid*="/${categoryName.toLowerCase()}"]`)
        .as(`${categoryName} Category Link`)

    this.heroSlideByIndex = (index) =>
      locate('[data-sentry-component="HeroCarousel"]')
        .find(`.slide:nth-child(${index})`)
        .as(`Hero Slide ${index}`)
  }

  // Navigation Methods
  async visit(country = "us") {
    const url = `/${country}/`
    I.amOnPage(url)
    //await I.handleAllModals();
    //this.verifyPageLoaded()
  }

  // Page Verification Methods
  verifyPageLoaded() {
    // Verify essential page structure
    I.waitForElement(this.navigation)
    I.waitForElement(this.heroCarousel)
    
    // Verify main navigation is present
    I.seeElement(this.knives)
    I.seeElement(this.cookware)
    
    // Verify key sections are present
    I.seeElement(this.footerRoot)
  }

  // Navigation interaction methods
  navigateToKnives() {
    I.waitForElement(this.knives)
    I.click(this.knives)
  }

  navigateToKnifeSets() {
    I.waitForElement(this.knifeSets)
    I.click(this.knifeSets)
  }

  navigateToCookware() {
    I.waitForElement(this.cookware)
    I.click(this.cookware)
  }

  navigateToKitchenTools() {
    I.waitForElement(this.kitchenTools)
    I.click(this.kitchenTools)
  }

  navigateToFlatware() {
    I.waitForElement(this.flatware)
    I.click(this.flatware)
  }

  navigateToSale() {
    I.waitForElement(this.sale)
    I.click(this.sale)
  }

  navigateToCategory(categoryName) {
    const categoryLink = this.categoryLinkByName(categoryName)
    I.waitForElement(categoryLink)
    I.click(categoryLink)
  }

  // Hero carousel interaction methods
  navigateToNextSlide() {
    I.waitForElement(this.nextSlide)
    I.click(this.nextSlide)
  }

  navigateToPreviousSlide() {
    I.waitForElement(this.prevSlide)
    I.click(this.prevSlide)
  }

  verifyHeroCarousel() {
    I.seeElement(this.heroCarousel)
    I.seeElement(this.nextSlide)
    I.seeElement(this.prevSlide)
  }

  // Gift Cards section methods
  verifyGiftCardsSection() {
    I.seeElement(this.giftCardsContainer)
    I.seeElement(this.giftCardsTitle)
    I.seeElement(this.giftCardsDescription)
  }

  clickGetYoursButton() {
    I.waitForElement(this.getYoursButton)
    I.click(this.getYoursButton)
  }

  verifyFooter() {
    I.seeElement(this.footerRoot)
  }
}

module.exports = new HomePage()