const { I } = inject();

/**
 * Cart Page Object - Handles shopping cart functionality
 */
module.exports = {
  // Organized locators by logical sections
  containers: {
    cartContainer: '[data-sentry-element="SheetContent"]',
    cartItems: 'ul[data-sentry-component="Products"] li',
    summarySection: '[data-sentry-component="Summary"]',
    shippingSection: '[data-sentry-component="Shipping"]',
    emptyCartContainer: '[data-sentry-component="CartEmpty"]',
  },

  items: {
    itemName: 'li > div a[data-sentry-element="Link"]',
    itemQuantity: '[data-testid="item-quantity"]', // Need to improve locator
    itemSubtotal: '[data-testid="item-subtotal"]', // Need to improve locator
    itemImage:
      '[data-sentry-component="ImageSalesforce"]>[data-sentry-component="ProductItemImage"]',
  },

  buttons: {
    removeItemBtn: 'button[data-sid^="cart_remove_cart_item"]',
    increaseQuantityBtn: 'button[aria-label="Increase item quantity"]',
    reduceQuantityBtn: 'button[aria-label="Reduce item quantity"]',
    closeCartBtn: '[data-sid="cart_close_cart_modal"]',
    checkoutBtn: '[data-sid="cart_checkout_button"]',
  },

  pricing: {
    subtotal: '[data-testid="cart-subtotal"]', // Need to improve locator
    tax: '[data-testid="cart-tax"]', // Need to improve locator
    shipping: '[data-testid="cart-shipping"]', // Need to improve locator
    total: '[data-testid="cart-total"]', // Need to improve locator
    discount: '[data-testid="cart-discount"]', // Need to improve locator
  },

  // Navigation Methods
  async proceedToCheckout() {
    try {
      await this.verifyCartNotEmpty();
      await I.waitForElement(this.buttons.checkoutBtn);

      // Ensure checkout button is enabled
      I.seeElement(this.buttons.checkoutBtn + ":not([disabled])");
      I.click(this.buttons.checkoutBtn);
    } catch (error) {
      throw new Error(`Failed to proceed to checkout: ${error.message}`);
    }
  },

  async closeCart() {
    try {
      await I.waitForElement(this.buttons.closeCartBtn);
      I.click(this.buttons.closeCartBtn);
    } catch (error) {
      throw new Error(`Failed to close cart: ${error.message}`);
    }
  },

  // Item Management Methods
  async removeItem(productName) {
    try {
      const itemIndex = await this.getItemIndex(productName);
      if (itemIndex === -1) {
        throw new Error(`Product "${productName}" not found in cart`);
      }

      const removeBtn = `${this.containers.cartItems}:nth-child(${
        itemIndex + 1
      }) ${this.buttons.removeItemBtn}`;
      await I.waitForElement(removeBtn);
      I.click(removeBtn);
    } catch (error) {
      throw new Error(
        `Failed to remove item "${productName}": ${error.message}`
      );
    }
  },

  async increaseQuantity(productName, times = 1) {
    try {
      const itemIndex = await this.getItemIndex(productName);
      if (itemIndex === -1) {
        throw new Error(`Product "${productName}" not found in cart`);
      }

      const increaseBtn = `${this.containers.cartItems}:nth-child(${
        itemIndex + 1
      }) ${this.buttons.increaseQuantityBtn}`;

      for (let i = 0; i < times; i++) {
        await I.waitForElement(increaseBtn);
        I.click(increaseBtn);
        I.wait(1); // Small delay between clicks
      }
    } catch (error) {
      throw new Error(
        `Failed to increase quantity for "${productName}": ${error.message}`
      );
    }
  },

  async reduceQuantity(productName, times = 1) {
    try {
      const itemIndex = await this.getItemIndex(productName);
      if (itemIndex === -1) {
        throw new Error(`Product "${productName}" not found in cart`);
      }

      const reduceBtn = `${this.containers.cartItems}:nth-child(${
        itemIndex + 1
      }) ${this.buttons.reduceQuantityBtn}`;

      for (let i = 0; i < times; i++) {
        await I.waitForElement(reduceBtn);
        I.click(reduceBtn);
        I.wait(1); // Small delay between clicks
      }
    } catch (error) {
      throw new Error(
        `Failed to reduce quantity for "${productName}": ${error.message}`
      );
    }
  },

  // Verification Methods
  async verifyCartDialogLoaded() {
    try {
      await I.waitForElement(this.containers.cartContainer);
      I.seeElement(this.containers.cartContainer);
    } catch (error) {
      throw new Error(`Cart dialog not loaded: ${error.message}`);
    }
  },

  async verifyCartNotEmpty() {
    try {
      const itemCount = await this.getItemCount();
      if (itemCount === 0) {
        throw new Error("Cart is empty");
      }

      console.log(`✅ Cart contains ${itemCount} items`);
    } catch (error) {
      throw new Error(`Cart verification failed: ${error.message}`);
    }
  },

  async verifyItemInCart(productName) {
    try {
      await I.waitForElement(this.containers.cartItems);
      I.see(productName, this.items.itemName);
    } catch (error) {
      throw new Error(
        `Item "${productName}" not found in cart: ${error.message}`
      );
    }
  },

  async verifyItemNotInCart(productName) {
    try {
      I.dontSee(productName, this.items.itemName);
    } catch (error) {
      throw new Error(
        `Item "${productName}" unexpectedly found in cart: ${error.message}`
      );
    }
  },

  async verifyEmptyCart() {
    try {
      I.seeElement(this.messages.emptyCartMessage);
      I.see("Your cart is empty", this.messages.emptyCartMessage);
    } catch (error) {
      throw new Error(`Empty cart verification failed: ${error.message}`);
    }
  },

  async verifyCartTotal(expectedTotal) {
    try {
      await I.waitForElement(this.pricing.total);
      I.see(expectedTotal, this.pricing.total);
    } catch (error) {
      throw new Error(`Cart total verification failed: ${error.message}`);
    }
  },

  async verifyItemQuantity(productName, expectedQuantity) {
    try {
      const itemIndex = await this.getItemIndex(productName);
      if (itemIndex === -1) {
        throw new Error(`Product "${productName}" not found in cart`);
      }

      const quantitySelector = `${this.containers.cartItems}:nth-child(${
        itemIndex + 1
      }) ${this.items.itemQuantity}`;
      I.see(expectedQuantity.toString(), quantitySelector);

      console.log(
        `✅ Quantity verified for ${productName}: ${expectedQuantity}`
      );
    } catch (error) {
      throw new Error(
        `Quantity verification failed for "${productName}": ${error.message}`
      );
    }
  },

  // Utility Methods
  async getItemCount() {
    try {
      await I.waitForElement(this.containers.cartContainer);
      const itemCount = await I.grabNumberOfVisibleElements(
        this.containers.cartItems
      );
      return itemCount;
    } catch (error) {
      console.error(`Error getting item count: ${error.message}`);
      return 0;
    }
  },

  async getItemIndex(productName) {
    try {
      const itemNames = await I.grabTextFromAll(this.items.itemName);
      return itemNames.findIndex((name) =>
        name.toLowerCase().includes(productName.toLowerCase())
      );
    } catch (error) {
      console.error(`Error getting item index: ${error.message}`);
      return -1;
    }
  },

  async getCartItems() {
    try {
      const itemNames = await I.grabTextFromAll(this.items.itemName);
      const itemPrices = await I.grabTextFromAll(this.items.itemPrice);
      const itemQuantities = await I.grabTextFromAll(this.items.itemQuantity);

      const items = itemNames.map((name, index) => ({
        name: name,
        price: itemPrices[index] || "N/A",
        quantity: itemQuantities[index] || "1",
      }));

      return items;
    } catch (error) {
      console.error(`Error getting cart items: ${error.message}`);
      return [];
    }
  },

  async getCartTotal() {
    try {
      await I.waitForElement(this.pricing.total);
      const total = await I.grabTextFrom(this.pricing.total);
      return total;
    } catch (error) {
      console.error(`Error getting cart total: ${error.message}`);
      return "0";
    }
  },

  async getCartSubtotal() {
    try {
      await I.waitForElement(this.pricing.subtotal);
      const subtotal = await I.grabTextFrom(this.pricing.subtotal);
      return subtotal;
    } catch (error) {
      console.error(`Error getting cart subtotal: ${error.message}`);
      return "0";
    }
  },

  // Validation Methods
  async validateCartState() {
    try {
      console.log("🔍 Validating cart state");

      await this.verifyCartDialogLoaded();

      const itemCount = await this.getItemCount();
      if (itemCount > 0) {
        // Cart has items - verify essential elements
        I.seeElement(this.pricing.subtotal);
        I.seeElement(this.pricing.total);
        I.seeElement(this.buttons.checkoutBtn);
      } else {
        // Cart is empty - verify empty state
        await this.verifyEmptyCart();
      }

      console.log("✅ Cart state validated");
    } catch (error) {
      throw new Error(`Cart state validation failed: ${error.message}`);
    }
  },

  // // Actions and methods for the cart page

  // // Navigate to the CheckOut page
  // proceedToCheckout() {
  //   I.click(this.checkoutgBtn);
  // },

  // // Verify the cart is displayed
  // verifyCartTotal(expectedTotal) {
  //   I.see(expectedTotal, this.total);
  // },

  // // Verify the cart is displayed
  // verifyItemInCart(productName) {
  //   I.see(productName, this.itemName);
  // },

  // // Verify empty card message is displayed
  // verifyEmptyCart() {
  //   I.seeElement(this.emptyCartMessage);
  //   I.see("Your cart is empty");
  // },

  // // Verify that the cart page is loaded
  // async verifyCartDialogLoaded() {
  //   I.seeElement(this.cartContainer);
  //   I.seeElement(this.cartItems);
  // },
};
