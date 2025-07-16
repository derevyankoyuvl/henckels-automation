const cardData = require("../../data/creditCards.json");

Feature("Henckels US - E-commerce Core Functionality");

// Test data constants
const TEST_DATA = {
  noResultsSearch: "test",
  searchParam: "thermometer",
  alertValidationMsg: "Error: Please confirm you are not a robot.",
  region: "us",
  productIndex: 0,
  categoryIndex: 0,
};

Before(async ({ I, HomePage }) => {
  // Common setup that applies to all scenarios
  await HomePage.visit(TEST_DATA.region);
});

Scenario(
  "User registration should require captcha validation",
  async ({ I, RegisterPage, Navigation }) => {
    const userData = await I.generateUserData();
    await Navigation.openSignUpPage();
    await RegisterPage.fillRegistrationForm(userData);
    await RegisterPage.acceptTermsAndConditions();
    await RegisterPage.submitForm();
    await RegisterPage.verifyAlertMsg(TEST_DATA.alertValidationMsg);
  }
);

Scenario(
  "Search functionality should handle both valid and invalid queries",
  async ({ I, Navigation, ProductCatalogPage }) => {
    // Test no results scenario
    await Navigation.openSearchDialog();
    await Navigation.enterSearchQuery(TEST_DATA.noResultsSearch);
    await ProductCatalogPage.verifySearchResults(TEST_DATA.noResultsSearch);
    // Test valid search scenario
    await Navigation.openSearchDialog();
    await Navigation.enterSearchQuery(TEST_DATA.searchParam);
    await ProductCatalogPage.verifySearchResults(TEST_DATA.searchParam);
  }
);

Scenario(
  "Complete order flow with credit card payment",
  async ({
    I,
    ProductCatalogPage,
    ProductDetailsPage,
    CartPage,
    CheckoutPage,
    ConfirmationPage,
    Navigation,
  }) => {
    const shippingData = await I.generateShippingData();
    await Navigation.openCategory(TEST_DATA.categoryIndex);
    await ProductCatalogPage.verifyPageLoaded();
    await ProductCatalogPage.openProductDetailsPage(TEST_DATA.productIndex);
    await ProductDetailsPage.verifyPageLoaded();
    await ProductDetailsPage.addToCart();
    await CartPage.verifyCartDialogLoaded();
    await CartPage.proceedToCheckout();
    await CheckoutPage.verifyPageLoaded();
    await CheckoutPage.fillGuestEmail(shippingData);
    await CheckoutPage.fillShippingInformation(shippingData);
    await CheckoutPage.continueToNextStep();
    await CheckoutPage.fillCreditCardInformation("visa", cardData);
    await CheckoutPage.submitOrder();
    await ConfirmationPage.verifyOrderCompletion(
      shippingData.firstName + " " + shippingData.lastName
    );
  }
);

Scenario(
  "Complete order flow with PayPal payment",
  async ({
    I,
    ProductCatalogPage,
    ProductDetailsPage,
    CartPage,
    CheckoutPage,
    ConfirmationPage,
    Navigation,
  }) => {
    const shippingData = await I.generateShippingData();
    await Navigation.openCategory(TEST_DATA.categoryIndex);
    await ProductCatalogPage.verifyPageLoaded();
    await ProductCatalogPage.openProductDetailsPage(TEST_DATA.productIndex);
    await ProductDetailsPage.verifyPageLoaded();
    await ProductDetailsPage.addToCart();
    await CartPage.verifyCartDialogLoaded();
    await CartPage.proceedToCheckout();
    await CheckoutPage.verifyPageLoaded();
    await CheckoutPage.fillGuestEmail(shippingData);
    await CheckoutPage.fillShippingInformation(shippingData);
    await CheckoutPage.continueToNextStep();
    await CheckoutPage.selectPaymentMethod("paypal");
    await CheckoutPage.submitOrderWithPayPal();
    await ConfirmationPage.verifyOrderCompletion(
      shippingData.firstName + " " + shippingData.lastName
    );
  }
);
