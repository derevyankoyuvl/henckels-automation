const { I } = inject()
const { expect } = require("@playwright/test")

/**
 * Cart Page Object - Handles shopping cart functionality
 * Uses Locator Builder pattern for better maintainability
 */
class CartPage {
  constructor() {
    // Container locators
    this.cartContainer = locate('[data-sentry-element="SheetContent"]').as(
      "Cart Container"
    )

    this.productsContainer = locate('ul[data-sentry-component="Products"]').as(
      "Products Container"
    )

    this.summarySection = locate('[data-sentry-component="Summary"]').as(
      "Summary Section"
    )

    this.shippingSection = locate('[data-sentry-component="Shipping"]').as(
      "Shipping Section"
    )

    this.emptyCartContainer = locate('[data-sentry-component="CartEmpty"]').as(
      "Empty Cart Container"
    )

    // Item locators
    this.cartItems = locate("li")
      .inside(this.productsContainer)
      .as("Cart Items")

    this.itemName = locate('a[data-sentry-element="Link"]')
      .inside("li > div")
      .as("Item Name")

    this.itemQuantity = locate('[data-testid="item-quantity"]').as(
      "Item Quantity"
    ) // Need to improve this locator to be more specific

    this.itemSubtotal = locate('[data-testid="item-subtotal"]').as(
      "Item Subtotal"
    ) // Need to improve this locator to be more specific

    this.itemImage = locate('[data-sentry-component="ProductItemImage"]')
      .inside('[data-sentry-component="ImageSalesforce"]')
      .as("Item Image")

    // Action button locators
    this.removeItemBtn = locate("button")
      .withAttr("data-sid", /^cart_remove_cart_item/)
      .as("Remove Item Button")

    this.increaseQuantityBtn = locate("button")
      .withAttr("aria-label", "Increase item quantity")
      .as("Increase Quantity Button")

    this.reduceQuantityBtn = locate("button")
      .withAttr("aria-label", "Reduce item quantity")
      .as("Reduce Quantity Button")

    this.closeCartBtn = locate('[data-sid="cart_close_cart_modal"]').as(
      "Close Cart Button"
    )

    this.checkoutBtn = locate('[data-sid="cart_checkout_button"]').as(
      "Checkout Button"
    )

    // Summary locators
    this.subtotal = locate('[data-testid="cart-subtotal"]')
      .inside(this.summarySection)
      .as("Cart Subtotal") // Need to improve this locator to be more specific

    this.tax = locate('[data-testid="cart-tax"]')
      .inside(this.summarySection)
      .as("Cart Tax") // Need to improve this locator to be more specific

    this.shipping = locate('[data-testid="cart-shipping"]')
      .inside(this.summarySection)
      .as("Cart Shipping") // Need to improve this locator to be more specific

    this.total = locate('[data-testid="cart-total"]')
      .inside(this.summarySection)
      .as("Cart Total") // Need to improve this locator to be more specific

    this.discount = locate('[data-testid="cart-discount"]')
      .inside(this.summarySection)
      .as("Cart Discount") // Need to improve this locator to be more specific

    // Dynamic locators for specific items
    this.itemByName = (productName) =>
      locate("li")
        .withChild(
          locate('a[data-sentry-element="Link"]').withText(productName)
        )
        .inside(this.productsContainer)
        .as(`${productName} Item Container`)

    this.itemQuantityByName = (productName) =>
      locate('[data-testid="item-quantity"]')
        .inside(this.itemByName(productName))
        .as(`${productName} Quantity`)

    this.removeButtonByName = (productName) =>
      locate('button[data-sid^="cart_remove_cart_item"]')
        .inside(this.itemByName(productName))
        .as(`Remove ${productName} Button`)

    this.increaseButtonByName = (productName) =>
      locate('button[aria-label="Increase item quantity"]')
        .inside(this.itemByName(productName))
        .as(`Increase ${productName} Quantity Button`)

    this.reduceButtonByName = (productName) =>
      locate('button[aria-label="Reduce item quantity"]')
        .inside(this.itemByName(productName))
        .as(`Reduce ${productName} Quantity Button`)

    // Messages
    this.emptyCartMessage = locate("text")
      .withText("Your cart is empty")
      .inside(this.emptyCartContainer)
      .as("Empty Cart Message")
  }

  // Navigation Methods
  async proceedToCheckout() {
    await this.verifyCartNotEmpty()
    I.waitForElement(this.checkoutBtn)
    I.click(this.checkoutBtn)
  }

  closeCart() {
    I.waitForElement(this.closeCartBtn)
    I.click(this.closeCartBtn)
  }

  // Item Management Methods
  removeItem(productName) {
    const removeBtn = this.removeButtonByName(productName)
    I.waitForElement(removeBtn)
    I.click(removeBtn)
  }

  increaseQuantity(productName, times = 1) {
    const increaseBtn = this.increaseButtonByName(productName)

    for (let i = 0; i < times; i++) {
      I.waitForElement(increaseBtn)
      I.click(increaseBtn)
      I.wait(1) // Small delay between clicks
    }
  }

  reduceQuantity(productName, times = 1) {
    const reduceBtn = this.reduceButtonByName(productName)

    for (let i = 0; i < times; i++) {
      I.waitForElement(reduceBtn)
      I.click(reduceBtn)
      I.wait(1) // Small delay between clicks
    }
  }

  // Verification Methods
  verifyCartDialogLoaded() {
    I.waitForElement(this.cartContainer)
    I.seeElement(this.cartContainer)
  }

  async verifyCartNotEmpty() {
    const itemCount = await this.getItemCount()
    expect(itemCount).toBeGreaterThan(0)
  }

  verifyItemInCart(productName) {
    I.waitForElement(this.cartItems)
    I.seeElement(this.itemByName(productName))
    I.see(productName, this.itemName)
  }

  verifyItemNotInCart(productName) {
    I.dontSeeElement(this.itemByName(productName))
    I.dontSee(productName, this.itemName)
  }

  verifyEmptyCart() {
    I.seeElement(this.emptyCartContainer)
    I.seeElement(this.emptyCartMessage)
  }

  verifyCartTotal(expectedTotal) {
    I.waitForElement(this.total)
    I.see(expectedTotal, this.total)
  }

  // Utility Methods - ONLY these methods use async/await for grab* operations
  async getItemCount() {
    I.waitForElement(this.cartContainer)
    try {
      const itemCount = await I.grabNumberOfVisibleElements(this.cartItems)
      return itemCount
    } catch (error) {
      // If no items found, return 0
      return 0
    }
  }

  async getItemIndex(productName) {
    const itemNames = await I.grabTextFromAll(this.itemName)
    return itemNames.findIndex((name) =>
      name.toLowerCase().includes(productName.toLowerCase())
    )
  }

  async getCartTotal() {
    I.waitForElement(this.total)
    const total = await I.grabTextFrom(this.total)
    return total.trim()
  }

  async getCartSubtotal() {
    I.waitForElement(this.subtotal)
    const subtotal = await I.grabTextFrom(this.subtotal)
    return subtotal.trim()
  }

  async getCartTax() {
    I.waitForElement(this.tax)
    const tax = await I.grabTextFrom(this.tax)
    return tax.trim()
  }

  async getCartShipping() {
    I.waitForElement(this.shipping)
    const shipping = await I.grabTextFrom(this.shipping)
    return shipping.trim()
  }

  async getItemQuantity(productName) {
    const quantityLocator = this.itemQuantityByName(productName)
    I.waitForElement(quantityLocator)
    const quantity = await I.grabTextFrom(quantityLocator)
    return parseInt(quantity.trim())
  }
}

module.exports = new CartPage()
