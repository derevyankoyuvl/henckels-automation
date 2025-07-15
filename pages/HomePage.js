const { I } = inject();

/**
 * Home Page Object - Handles homepage functionality and navigation
 * Represents the main landing page for Henckels US website
 */
module.exports = {
  header: {
    navigation: "header.sticky",
    logo: '//a[@data-sid="menu_logohome"]',
  },

  shopByCategory: {
    knives: 'a[data-sid*="/knives"]',
    knifeSets: 'a[data-sid*="/knife-set"]',
    cookware: 'a[data-sid*="/cookware"]',
    kitchenTools: 'a[data-sid*="/tools-accessories"]',
    flatware: 'a[data-sid*="/flatware"]',
    sale: 'a[data-sid*="/sale"]',
  },

  heroSection: {
    heroCarousel: '[data-sentry-component="HeroCarousel"]',
    carousel: {
      prevSlide: 'button[data-sid="home_hero_previous_slide"]',
      nextSlide: 'button[data-sid="home_hero_next_slide"]',
    },
  },

  footer: {
    root: "#reduced-footer",
  },

  giftCardsSection: {
    container: '[data-sentry-component="DefaultVariation"]',
    title: '[data-sentry-component="DefaultVariation"] h3',
    description: '[data-sentry-component="DefaultVariation"] p',
    getYoursButton: '[data-sid="home_hero_button_get_yours_now"]',
    brandLogos: 'img[alt="GIFT CARDS"]'
  },

  // Navigation Methods
  async visit(country = "us") {
    try {
      const url = `/${country}/`;
      await I.amOnPage(url);
      await I.handleAllModals();
      await this.verifyPageLoaded();
    } catch (error) {
      throw new Error(`Failed to visit homepage: ${error.message}`);
    }
  },

  // Page Verification Methods
  async verifyPageLoaded() {
    try {
      // Verify essential page structure
      await I.waitForElement(this.header.navigation);
      await I.waitForElement(this.heroSection.heroCarousel);
      
      // Verify main navigation is present
      I.seeElement(this.shopByCategory.knives);
      I.seeElement(this.shopByCategory.cookware);
      
      // Verify key sections are present
      I.seeElement(this.footer.root);
    } catch (error) {
      throw new Error(`Homepage not loaded properly: ${error.message}`);
    }
  },
};