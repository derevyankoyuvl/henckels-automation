const { I, messages } = inject()

/**
 * Order Confirmation Page Object - Handles order confirmation and verification
 * Uses Locator Builder pattern for better maintainability
 */
class OrderConfirmationPage {
  constructor() {
    // Thank You section locators
    this.thankYouSection = locate("#orderconfirmation-content").as(
      "Thank You Section"
    )
    this.thankYouTitle = locate("h1")
      .inside(this.thankYouSection)
      .as("Thank You Title")
    this.thankYouMessage = locate(".bg-card h2")
      .inside(this.thankYouSection)
      .as("Thank You Message")

    // Order Details section locators
    this.orderDetailsSection = locate(
      '[data-sentry-component="OrderDetails"]'
    ).as("Order Details Section")
    this.orderDetailsTitle = locate("h3")
      .inside(this.orderDetailsSection)
      .as("Order Details Title")
    this.orderDetailsNumber = locate(
      '[data-sentry-element="CardDescription"] span'
    )
      .inside(this.orderDetailsSection)
      .as("Order Details Number")
    this.orderDetailsDate = locate(
      '[data-sentry-element="CardDescription"] > div.text-base'
    )
      .inside(this.orderDetailsSection)
      .last()
      .as("Order Details Date")
    this.orderDetailsStatus = locate(
      '[data-sentry-element="CardDescription"] > div.text-base > div'
    )
      .inside(this.orderDetailsSection)
      .as("Order Details Status")

    // Order Summary section locators
    this.orderSummaryContainer = locate(
      '[data-testid="order-products"], .order-products'
    ).as("Order Summary Container")
    this.orderSummaryProductItem = locate(
      '[data-sentry-component="OrderItems"]'
    ).as("Order Summary Product Item")
    this.orderSummaryProductName = locate(
      '[data-sentry-component="OrderItems"]'
    ).as("Order Summary Product Name")
    this.orderSummaryProductQuantity = locate(
      '[data-sentry-component="OrderItems"]'
    ).as("Order Summary Product Quantity")
    this.orderSummaryProductImage = locate(
      '[data-sentry-component="OrderItems"]'
    ).as("Order Summary Product Image")
    this.orderSummaryProductAccordion = locate(
      '[data-sentry-element="AccordionTrigger"]'
    ).as("Order Summary Product Accordion")

    // Price info locators
    this.priceInfoSection = locate(
      '[data-sentry-component="OrderPriceInfo"]'
    ).as("Price Info Section")
    this.orderSummaryProductPrice = locate(
      '[data-sentry-component="OrderPriceInfo"]'
    ).as("Order Summary Product Price")
    this.orderSummarySubtotal = locate(
      '[data-sentry-component="OrderPriceInfo"]'
    ).as("Order Summary Subtotal")
    this.orderSummaryTax = locate(
      '[data-sentry-component="OrderPriceInfo"]'
    ).as("Order Summary Tax")
    this.orderSummaryShipping = locate(
      '[data-sentry-component="OrderPriceInfo"]'
    ).as("Order Summary Shipping")
    this.orderSummaryDiscount = locate(
      '[data-sentry-component="OrderPriceInfo"]'
    ).as("Order Summary Discount")
    this.orderSummaryTotal = locate('[data-sentry-element="CardContent"] > div')
      .inside(this.priceInfoSection)
      .last()
      .as("Order Summary Total")
    this.orderSummaryPromoCode = locate(
      '[data-sentry-component="OrderPriceInfo"]'
    ).as("Order Summary Promo Code")

    // Address section locators
    this.addressInfoSection = locate(
      '[data-sentry-component="OrderAddressInfo"]'
    ).as("Address Info Section")
    this.addressesShippingSection = locate(
      '[data-sentry-component="OrderAddressInfo"]'
    ).as("Shipping Address Section")
    this.addressesBillingSection = locate(
      '[data-sentry-component="OrderAddressInfo"]'
    ).as("Billing Address Section")
    this.addressesCustomerName = locate(
      '[data-sentry-component="OrderAddressInfo"]'
    ).as("Customer Name")
    this.addressesStreetAddress = locate(
      '[data-sentry-component="OrderAddressInfo"]'
    ).as("Street Address")
    this.addressesCityStateZip = locate(
      '[data-sentry-component="OrderAddressInfo"]'
    ).as("City State Zip")
    this.addressesCountry = locate(
      '[data-sentry-component="OrderAddressInfo"]'
    ).as("Country")
    this.addressesPhoneNumber = locate(
      '[data-sentry-component="OrderAddressInfo"]'
    ).as("Phone Number")

    // Payment section locators
    this.paymentSection = locate(
      '[data-sentry-component="OrderPaymentInfo"]'
    ).as("Payment Section")
    this.paymentMethod = locate(
      '[data-sentry-component="OrderPaymentInfo"]'
    ).as("Payment Method")
    this.paymentAmount = locate(
      '[data-sentry-component="OrderPaymentInfo"]'
    ).as("Payment Amount")

    // Actions locators
    this.actionsContinueShoppingButton = locate(
      '[data-sid="checkout_continueshopping"]'
    ).as("Continue Shopping Button")

    // Dynamic locators for specific products
    this.productByName = (productName) =>
      locate('[data-sentry-component="OrderItems"]')
        .withChild(locate("text").withText(productName))
        .as(`${productName} Product Item`)
  }

  verifyPageLoaded() {
    // Wait for essential sections to load
    I.waitForElement(this.thankYouSection)
    I.waitForElement(this.orderDetailsSection)

    // Verify key components are present
    I.seeElement(this.thankYouTitle)
  }

  // Thank You Message Verification
  verifyThankYouMessage(customerName) {
    // Wait for thank you message
    I.waitForElement(this.thankYouTitle)

    // Check for thank you message with customer name
    I.see(`${messages.thankYouText}, ${customerName}`, this.thankYouTitle)

    // Verify confirmation text
    I.see(messages.confirmationText, this.thankYouMessage)
    I.see(messages.spamWarning, this.thankYouMessage)
  }

  verifyOrderCompletion(customerName) {
    this.verifyPageLoaded()
    this.verifyThankYouMessage(customerName)
  }

  async _getOrderNumber() {
    I.waitForElement(this.orderDetailsNumber)
    const orderNumber = await I.grabTextFrom(this.orderDetailsNumber)
    return orderNumber.trim()
  }

  async _getOrderDate() {
    I.waitForElement(this.orderDetailsDate)
    const orderDate = await I.grabTextFrom(this.orderDetailsDate)
    const datePart = orderDate.trim().split("NOT SHIPPED")[0]
    return datePart.trim()
  }

  async _getOrderStatus() {
    I.waitForElement(this.orderDetailsStatus)
    const orderStatus = await I.grabTextFrom(this.orderDetailsStatus)
    return orderStatus.trim()
  }

  async _getOrderTotal() {
    const isMobile = process.env.SCREEN_SIZE === "mobile"
    if (isMobile) {
      I.waitForElement(this.orderSummaryProductAccordion)
      I.click(this.orderSummaryProductAccordion)
    }
    I.waitForElement(this.orderSummaryTotal)
    const fullText = await I.grabTextFrom(this.orderSummaryTotal)

    // Extract price pattern $XX.XX
    const priceMatch = fullText.trim().match(/\$\d+\.\d{2}/)

    if (priceMatch) {
      console.log(`Extracted price: ${priceMatch[0]} from: ${fullText.trim()}`)
      return priceMatch[0]
    } else {
      console.warn(`Could not extract price from: ${fullText.trim()}`)
      return fullText.trim()
    }
  } 

  // Method to get all order details at once
  async getAllOrderDetails(testName = "") {
    const orderNumber = await this._getOrderNumber()
    const orderDate = await this._getOrderDate()
    const orderStatus = await this._getOrderStatus()
    const orderTotal = await this._getOrderTotal()

    const orderDetails = {
      orderNumber,
      orderDate,
      orderStatus,
      orderTotal,
    }

    console.log("Order Details:", orderDetails)

    // Save to file
    if (global.orderNumberManager) {
      global.orderNumberManager.saveOrderDetails(orderDetails, testName)
    }
    return orderDetails
  }

  // Product verification methods
  verifyProductInOrder(productName) {
    I.seeElement(this.productByName(productName))
  }

  // Payment verification methods
  verifyPaymentMethod(expectedMethod) {
    I.waitForElement(this.paymentSection)
    I.see(expectedMethod, this.paymentMethod)
  }

  verifyPaymentAmount(expectedAmount) {
    I.waitForElement(this.paymentSection)
    I.see(expectedAmount, this.paymentAmount)
  }

  // Navigation methods
  continueShopping() {
    I.waitForElement(this.actionsContinueShoppingButton)
    I.click(this.actionsContinueShoppingButton)
  }
}

module.exports = new OrderConfirmationPage()