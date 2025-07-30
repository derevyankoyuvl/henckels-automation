const {
  I,
  HomePage,
  ProductCatalogPage,
  ProductDetailsPage,
  CartPage,
  CheckoutPage,
  ConfirmationPage,
  RegisterPage,
  Navigation,
  cardData,
  gcData,
  messages,
} = inject()

Feature("Henckels US - E-commerce Core Functionality")

Before(async ({ I, HomePage }) => {
  // Common setup that applies to all scenarios
  await HomePage.visit(process.env.COUNTRY)
})

Scenario("User registration should require captcha validation", async () => {
  const userData = await I.generateUserData()
  Navigation.openSignUpPage()
  RegisterPage.fillRegistrationForm(userData)
  RegisterPage.acceptTermsAndConditions()
  RegisterPage.submitForm()
  RegisterPage.verifyAlertMsg(messages.captchaValidation)
})

Scenario(
  "Search functionality should handle both valid and invalid queries",
  async () => {
    // Test no results scenario
    Navigation.openSearchDialog()
    Navigation.enterSearchQuery("test")
    await ProductCatalogPage.verifySearchReturnsNoResults("test")
    // Test valid search scenario
    Navigation.openSearchDialog()
    Navigation.enterSearchQuery("thermometer")
    await ProductCatalogPage.verifySearchReturnsResults("thermometer")
  }
)

Scenario("Complete order flow with credit card payment", async () => {
  const shippingData = await I.generateShippingData()
  await Navigation.openCategory(0)
  ProductCatalogPage.verifyPageLoaded()
  await ProductCatalogPage.openProductDetailsPage(0)
  ProductDetailsPage.verifyPageLoaded()
  ProductDetailsPage.addToCart()
  CartPage.verifyCartDialogLoaded()
  await CartPage.proceedToCheckout()
  CheckoutPage.verifyPageLoaded()
  CheckoutPage.fillGuestEmail(shippingData)
  CheckoutPage.fillShippingInformation(shippingData)
  CheckoutPage.continueToNextStep()
  await CheckoutPage.keepEnteredAddress()
  CheckoutPage.fillCreditCardInformation("visa", cardData)
  CheckoutPage.submitOrder()
  ConfirmationPage.verifyOrderCompletion(
    shippingData.firstName + " " + shippingData.lastName
  )
})

Scenario("Complete order flow with PayPal payment", async () => {
  const shippingData = await I.generateShippingData()
  await Navigation.openCategory(0)
  ProductCatalogPage.verifyPageLoaded()
  await ProductCatalogPage.openProductDetailsPage(0)
  ProductDetailsPage.verifyPageLoaded()
  ProductDetailsPage.addToCart()
  CartPage.verifyCartDialogLoaded()
  await CartPage.proceedToCheckout()
  CheckoutPage.verifyPageLoaded()
  CheckoutPage.fillGuestEmail(shippingData)
  CheckoutPage.fillShippingInformation(shippingData)
  CheckoutPage.continueToNextStep()
  await CheckoutPage.keepEnteredAddress()
  CheckoutPage.selectPaymentMethod("paypal")
  CheckoutPage.submitOrderWithPayPal()
  ConfirmationPage.verifyOrderCompletion(
    shippingData.firstName + " " + shippingData.lastName
  )
})

Scenario("Complete order flow with Klarna payment", async () => {
  const shippingData = await I.generateShippingData()
  await Navigation.openCategory(0)
  ProductCatalogPage.verifyPageLoaded()
  await ProductCatalogPage.openProductDetailsPage(0)
  ProductDetailsPage.verifyPageLoaded()
  ProductDetailsPage.addToCart()
  CartPage.verifyCartDialogLoaded()
  await CartPage.proceedToCheckout()
  CheckoutPage.verifyPageLoaded()
  CheckoutPage.fillGuestEmail(shippingData)
  CheckoutPage.fillShippingInformation(shippingData)
  CheckoutPage.continueToNextStep()
  await CheckoutPage.keepEnteredAddress()
  CheckoutPage.selectPaymentMethod("klarna")
  await CheckoutPage.submitOrderWithKlarna()
  ConfirmationPage.verifyOrderCompletion(
    shippingData.firstName + " " + shippingData.lastName
  )
})

Scenario.skip("Complete order flow with GooglePay payment", async () => {
  const shippingData = await I.generateShippingData()
  await Navigation.openCategory(0)
  ProductCatalogPage.verifyPageLoaded()
  await ProductCatalogPage.openProductDetailsPage(0)
  ProductDetailsPage.verifyPageLoaded()
  ProductDetailsPage.addToCart()
  CartPage.verifyCartDialogLoaded()
  await CartPage.proceedToCheckout()
  CheckoutPage.verifyPageLoaded()
  CheckoutPage.fillGuestEmail(shippingData)
  CheckoutPage.fillShippingInformation(shippingData)
  CheckoutPage.continueToNextStep()
  await CheckoutPage.keepEnteredAddress()
  CheckoutPage.selectPaymentMethod("googlepay")
  CheckoutPage.submitOrderWithGooglePay()
  ConfirmationPage.verifyOrderCompletion(
    shippingData.firstName + " " + shippingData.lastName
  )
})

Scenario("Complete order flow with Gift Card payment", async () => {
  const shippingData = await I.generateShippingData()
  await Navigation.openCategory(0)
  ProductCatalogPage.verifyPageLoaded()
  await ProductCatalogPage.openProductDetailsPage(0)
  ProductDetailsPage.verifyPageLoaded()
  ProductDetailsPage.addToCart()
  CartPage.verifyCartDialogLoaded()
  await CartPage.proceedToCheckout()
  CheckoutPage.verifyPageLoaded()
  CheckoutPage.fillGuestEmail(shippingData)
  CheckoutPage.fillShippingInformation(shippingData)
  CheckoutPage.continueToNextStep()
  await CheckoutPage.keepEnteredAddress()
  CheckoutPage.selectPaymentMethod("gift_card")
  CheckoutPage.fillGiftCardInformation("full", gcData)
  CheckoutPage.submitOrderWithGiftCard()
  ConfirmationPage.verifyOrderCompletion(
    shippingData.firstName + " " + shippingData.lastName
  )
})
