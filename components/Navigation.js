const { I } = inject();

/**
 * Navigation Component - Handles header and footer navigation elements
 */
class Navigation {
  constructor() {
    // Header locators
    this.navigation = "header.sticky";
    this.categoryLinks = "header.sticky  li  a";
    this.skipToMain = "#uw-skip-to-main";
    this.openNav = '//button[contains(text(), "Open Navigation")]';
    this.searchButton = '//button[@data-sid="menu_quicksearch"]';
    this.searchDialog = '[role="dialog"]';
    this.searchInput = '//input[@data-sid="menu_search_input"]';
    this.accountMenu = '//button[@data-sid="menu_account"]';
    this.signIn = '//a[@data-sid="menu_signin"]';
    this.signUp = '//a[@data-sid="menu_register"]';
    this.cartIcon = '//button[@data-sid="menu_cart"]';
    this.logo = '//a[@data-sid="menu_logohome"]';
    this.accountMenuTitle = '//h1[contains(text(), "CREATE AN ACCOUNT")]';

    // Footer locators
    this.footerRoot = "#reduced-footer";
    this.contactLink = '//a[contains(text(), "Contact us here!")]';
    this.shippingInfo = '//a[contains(text(), "Shipping Information")]';
    this.accessibility = "#userway_widget_trigger";
  }

  // Account Management Methods
  async openAccountMenu() {
    await I.waitForElement(this.accountMenu);
    I.click(this.accountMenu);
  }

  async openSignUpPage() {
    await this.openAccountMenu();
    await I.waitForElement(this.signUp);
    I.click(this.signUp);
    await I.waitForElement(this.accountMenuTitle);
  }

  async openSignInPage() {
    await this.openAccountMenu();
    await I.waitForElement(this.signIn);
    I.click(this.signIn);
  }

  // Search Methods
  async openSearchDialog() {
    await I.waitForElement(this.searchButton);
    I.click(this.searchButton);
    await I.waitForElement(this.searchDialog);
  }

  async enterSearchQuery(query) {
    await I.waitForElement(this.searchInput);
    I.fillField(this.searchInput, query);
    I.pressKey("Enter");
  }

  async performSearch(query) {
    await this.openSearchDialog();
    await this.enterSearchQuery(query);
  }

  // Category Navigation Methods
  // Helper function to convert a string to title case
  toTitleCase(str) {
    if (!str) {
      return "";
    }
    return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  }

  async getAvailableCategoriesFromHeader() {
    const categories = [];

    const categoryTexts = await I.grabTextFromAll(this.categoryLinks);
    const categoryHrefs = await I.grabAttributeFromAll(
      this.categoryLinks,
      "href"
    );

    for (let i = 0; i < categoryTexts.length; i++) {
      let selectorCategoryName = this.toTitleCase(categoryTexts[i].trim());
      categories.push({
        name: categoryTexts[i].trim(),
        url: categoryHrefs[i],
        selector: `//span[contains(text(), '${selectorCategoryName}')]`,
        index: i,
      });
    }
    return categories;
  }

  async openCategory(categoryIndex) {
    const categories = await this.getAvailableCategoriesFromHeader();
    const category = categories[categoryIndex];
    I.click(category.selector);
    I.wait(2); // Wait for navigation
    return category;
  }

  async isCategoryAvailable(categoryName) {
    const categories = await this.getAvailableCategories();
    return categories.some((cat) =>
      cat.name.toLowerCase().includes(categoryName.toLowerCase())
    );
  }

  async openCategoryByName(categoryName) {
    const categories = await this.getAvailableCategories();
    const targetCategory = categories.find((cat) =>
      cat.name.toLowerCase().includes(categoryName.toLowerCase())
    );
    return await this.openCategory(targetCategory.index);
  }
}

module.exports = new Navigation();
