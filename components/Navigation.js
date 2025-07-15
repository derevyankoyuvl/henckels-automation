const { I } = inject();

/**
 * Navigation Component - Handles header and footer navigation elements
 */
class Navigation {
  constructor() {
    // Locators organized by logical sections
    this.header = {
      navigation: "header.sticky",
      categoryLinks: "header.sticky  li  a",
      skipToMain: "#uw-skip-to-main",
      openNav: '//button[contains(text(), "Open Navigation")]',
      searchButton: '//button[@data-sid="menu_quicksearch"]',
      searchDialog: '[role="dialog"]',
      searchInput: '//input[@data-sid="menu_search_input"]',
      accountMenu: '//button[@data-sid="menu_account"]',
      signIn: '//a[@data-sid="menu_signin"]',
      signUp: '//a[@data-sid="menu_register"]',
      cartIcon: '//button[@data-sid="menu_cart"]',
      logo: '//a[@data-sid="menu_logohome"]',
      accountMenuTitle: '//h1[contains(text(), "CREATE AN ACCOUNT")]',
    };

    this.footer = {
      root: "#reduced-footer",
      contactLink: '//a[contains(text(), "Contact us here!")]',
      shippingInfo: '//a[contains(text(), "Shipping Information")]',
      accessibility: "#userway_widget_trigger",
    };
  }

  // Account Management Methods
  async openAccountMenu() {
    try {
      await I.waitForElement(this.header.accountMenu);
      I.click(this.header.accountMenu);
    } catch (error) {
      throw new Error(`Failed to open account menu: ${error.message}`);
    }
  }

  async openSignUpPage() {
    try {
      await this.openAccountMenu();
      await I.waitForElement(this.header.signUp);
      I.click(this.header.signUp);
      await I.waitForElement(this.header.accountMenuTitle);
    } catch (error) {
      throw new Error(`Failed to open sign up page: ${error.message}`);
    }
  }

  async openSignInPage() {
    try {
      await this.openAccountMenu();
      await I.waitForElement(this.header.signIn);
      I.click(this.header.signIn);
    } catch (error) {
      throw new Error(`Failed to open sign in page: ${error.message}`);
    }
  }

  // Search Methods
  async openSearchDialog() {
    try {
      await I.waitForElement(this.header.searchButton);
      I.click(this.header.searchButton);
      await I.waitForElement(this.header.searchDialog);
    } catch (error) {
      throw new Error(`Failed to open search dialog: ${error.message}`);
    }
  }

  async enterSearchQuery(query) {
    try {
      if (!query || query.trim() === "") {
        throw new Error("Search query cannot be empty");
      }

      await I.waitForElement(this.header.searchInput);
      I.fillField(this.header.searchInput, query);
      I.pressKey("Enter");
    } catch (error) {
      throw new Error(
        `Failed to enter search query "${query}": ${error.message}`
      );
    }
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

    try {
      const categoryTexts = await I.grabTextFromAll(this.header.categoryLinks);
      const categoryHrefs = await I.grabAttributeFromAll(
        this.header.categoryLinks,
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
    } catch (error) {
      console.log("❌ Error getting categories:", error.message);
      return [];
    }
  }

  async openCategory(categoryIndex) {
    try {
      const categories = await this.getAvailableCategoriesFromHeader();

      if (categories.length === 0) {
        console.log("⚠️ No categories available to click");
        return null;
      }
      const category = categories[categoryIndex];
      I.click(category.selector);
      I.wait(2); // Wait for navigation
      return category;
    } catch (error) {
      throw new Error(
        `Failed to open category at index ${categoryIndex}: ${error.message}`
      );
    }
  }

  async isCategoryAvailable(categoryName) {
    try {
      const categories = await this.getAvailableCategories();
      return categories.some((cat) =>
        cat.name.toLowerCase().includes(categoryName.toLowerCase())
      );
    } catch (error) {
      console.error(`Error checking category availability: ${error.message}`);
      return false;
    }
  }

  async openCategoryByName(categoryName) {
    try {
      if (!categoryName || categoryName.trim() === "") {
        throw new Error("Category name cannot be empty");
      }

      const categories = await this.getAvailableCategories();
      const targetCategory = categories.find((cat) =>
        cat.name.toLowerCase().includes(categoryName.toLowerCase())
      );

      if (!targetCategory) {
        const availableNames = categories.map((c) => c.name).join(", ");
        throw new Error(
          `Category "${categoryName}" not found. Available: ${availableNames}`
        );
      }

      return await this.openCategory(targetCategory.index);
    } catch (error) {
      throw new Error(
        `Failed to open category "${categoryName}": ${error.message}`
      );
    }
  }
}

module.exports = new Navigation();
