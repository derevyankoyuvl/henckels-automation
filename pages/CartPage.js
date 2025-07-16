const { I } = inject();
const { expect } = require("@playwright/test");

/**
 * Cart Page Object - Handles shopping cart functionality
 */
module.exports = {
  // Organized locators by logical sections
  cartContainer: '[data-sentry-element="SheetContent"]',
  cartItems: 'ul[data-sentry-component="Products"] li',
  summarySection: '[data-sentry-component="Summary"]',
  shippingSection: '[data-sentry-component="Shipping"]',
  emptyCartContainer: '[data-sentry-component="CartEmpty"]',
  itemName: 'li > div a[data-sentry-element="Link"]',
  itemQuantity: '[data-testid="item-quantity"]', // Need to improve locator
  itemSubtotal: '[data-testid="item-subtotal"]', // Need to improve locator
  itemImage:
    '[data-sentry-component="ImageSalesforce"]>[data-sentry-component="ProductItemImage"]',
  removeItemBtn: 'button[data-sid^="cart_remove_cart_item"]',
  increaseQuantityBtn: 'button[aria-label="Increase item quantity"]',
  reduceQuantityBtn: 'button[aria-label="Reduce item quantity"]',
  closeCartBtn: '[data-sid="cart_close_cart_modal"]',
  checkoutBtn: '[data-sid="cart_checkout_button"]',
  subtotal: '[data-testid="cart-subtotal"]', // Need to improve locator
  tax: '[data-testid="cart-tax"]', // Need to improve locator
  shipping: '[data-testid="cart-shipping"]', // Need to improve locator
  total: '[data-testid="cart-total"]', // Need to improve locator
  discount: '[data-testid="cart-discount"]', // Need to improve locator

  // Navigation Methods
  async proceedToCheckout() {
    await this.verifyCartNotEmpty();
    await I.waitForElement(this.checkoutBtn);
    I.seeElement(this.checkoutBtn + ":not([disabled])");
    I.click(this.checkoutBtn);
  },

  async closeCart() {
    await I.waitForElement(this.closeCartBtn);
    I.click(this.closeCartBtn);
  },

  // Item Management Methods
  async removeItem(productName) {
    const itemIndex = await this.getItemIndex(productName);
    const removeBtn = `${this.cartItems}:nth-child(${itemIndex + 1}) ${
      this.removeItemBtn
    }`;
    await I.waitForElement(removeBtn);
    I.click(removeBtn);
  },

  async increaseQuantity(productName, times = 1) {
    const itemIndex = await this.getItemIndex(productName);
    const increaseBtn = `${this.cartItems}:nth-child(${itemIndex + 1}) ${
      this.increaseQuantityBtn
    }`;

    for (let i = 0; i < times; i++) {
      await I.waitForElement(increaseBtn);
      I.click(increaseBtn);
      I.wait(1); // Small delay between clicks
    }
  },

  async reduceQuantity(productName, times = 1) {
    const itemIndex = await this.getItemIndex(productName);
    const reduceBtn = `${this.cartItems}:nth-child(${itemIndex + 1}) ${
      this.buttons.reduceQuantityBtn
    }`;

    for (let i = 0; i < times; i++) {
      await I.waitForElement(reduceBtn);
      I.click(reduceBtn);
      I.wait(1); // Small delay between clicks
    }
  },

  // Verification Methods
  async verifyCartDialogLoaded() {
    await I.waitForElement(this.cartContainer);
    I.seeElement(this.cartContainer);
  },

  async verifyCartNotEmpty() {
    const itemCount = await this.getItemCount();
    expect(itemCount).toBeGreaterThan(0);
  },

  async verifyItemInCart(productName) {
    await I.waitForElement(this.cartItems);
    I.see(productName, this.itemName);
  },

  async verifyItemNotInCart(productName) {
    I.dontSee(productName, this.itemName);
  },

  async verifyEmptyCart() {
    I.seeElement(this.messages.emptyCartMessage);
    I.see("Your cart is empty", this.emptyCartMessage);
  },

  async verifyCartTotal(expectedTotal) {
    await I.waitForElement(this.total);
    I.see(expectedTotal, this.total);
  },

  async verifyItemQuantity(productName, expectedQuantity) {
    const itemIndex = await this.getItemIndex(productName);
    const quantitySelector = `${this.cartItems}:nth-child(${itemIndex + 1}) ${
      this.itemQuantity
    }`;
    I.see(expectedQuantity.toString(), quantitySelector);
  },

  // Utility Methods
  async getItemCount() {
    await I.waitForElement(this.cartContainer);
    const itemCount = await I.grabNumberOfVisibleElements(this.cartItems);
    return itemCount;
  },

  async getItemIndex(productName) {
    const itemNames = await I.grabTextFromAll(this.itemName);
    return itemNames.findIndex((name) =>
      name.toLowerCase().includes(productName.toLowerCase())
    );
  },

  async getCartItems() {
    const itemNames = await I.grabTextFromAll(this.items.itemName);
    const itemPrices = await I.grabTextFromAll(this.items.itemPrice);
    const itemQuantities = await I.grabTextFromAll(this.items.itemQuantity);

    const items = itemNames.map((name, index) => ({
      name: name,
      price: itemPrices[index] || "N/A",
      quantity: itemQuantities[index] || "1",
    }));
    return items;
  },

  async getCartTotal() {
    await I.waitForElement(this.total);
    const total = await I.grabTextFrom(this.total);
    return total;
  },

  async getCartSubtotal() {
    await I.waitForElement(this.subtotal);
    const subtotal = await I.grabTextFrom(this.subtotal);
    return subtotal;
  },

  // Validation Methods
  async validateCartState() {
    await this.verifyCartDialogLoaded();

    const itemCount = await this.getItemCount();
    I.seeElement(this.subtotal);
    I.seeElement(this.total);
    I.seeElement(this.checkoutBtn);
  },
};
