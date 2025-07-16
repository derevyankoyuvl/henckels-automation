const { I } = inject();

/**
 * Home Page Object - Handles homepage functionality and navigation
 * Represents the main landing page for Henckels US website
 */
module.exports = {
  // Header locators
  navigation: "header.sticky",
  logo: '//a[@data-sid="menu_logohome"]',

  // Shop by Category locators
  knives: 'a[data-sid*="/knives"]',
  knifeSets: 'a[data-sid*="/knife-set"]',
  cookware: 'a[data-sid*="/cookware"]',
  kitchenTools: 'a[data-sid*="/tools-accessories"]',
  flatware: 'a[data-sid*="/flatware"]',
  sale: 'a[data-sid*="/sale"]',

  // Hero Section locators
  heroCarousel: '[data-sentry-component="HeroCarousel"]',
  prevSlide: 'button[data-sid="home_hero_previous_slide"]',
  nextSlide: 'button[data-sid="home_hero_next_slide"]',

  // Footer locators
  footerRoot: "#reduced-footer",

  // Gift Cards Section locators
  giftCardsContainer: '[data-sentry-component="DefaultVariation"]',
  giftCardsTitle: '[data-sentry-component="DefaultVariation"] h3',
  giftCardsDescription: '[data-sentry-component="DefaultVariation"] p',
  getYoursButton: '[data-sid="home_hero_button_get_yours_now"]',
  brandLogos: 'img[alt="GIFT CARDS"]',

  // Navigation Methods
  async visit(country = "us") {
    const url = `/${country}/`;
    await I.amOnPage(url);
    await I.handleAllModals();
    await this.verifyPageLoaded();
  },

  // Page Verification Methods
  async verifyPageLoaded() {
    // Verify essential page structure
    await I.waitForElement(this.navigation);
    await I.waitForElement(this.heroCarousel);

    // Verify main navigation is present
    I.seeElement(this.knives);
    I.seeElement(this.cookware);

    // Verify key sections are present
    I.seeElement(this.footerRoot);
  },
};
