require("dotenv").config();
const { setHeadlessWhen, setCommonPlugins } = require("@codeceptjs/configure");
const SignInPage = require("./pages/SignInPage");

// export HEADLESS=true && npx codeceptjs run
//setHeadlessWhen(process.env.HEADLESS);

// enable all common plugins https://github.com/codeceptjs/configure#setcommonplugins
setCommonPlugins();

const ENV = process.env.NODE_ENV || "staging";

exports.config = {
  tests: "./tests/**/*_test.js",
  output: "./output",
  helpers: {
    Playwright: {
      url: getBaseUrl(),
      show: process.env.HEADLESS !== "true",
      browser: process.env.BROWSER || "chromium",
      windowSize: getWindowSize(),
      waitForTimeout: 30000,
      waitForAction: 1000,
      timeout: 30000,
      chromium: {
        args: ["--no-sandbox", "--disable-dev-shm-usage"],
      },
    },
    DataHelper: {
      require: "./helpers/DataHelper.js",
    },
    MailSlurpHelper: {
      require: "./helpers/MailSlurpHelper.js",
      apiKey: process.env.MAILSLURP_API_KEY, // Store your API key in environment variables
    },
    ScreenshotHelper: {
      require: "./helpers/ScreenshotHelper.js",
    },
  },
  include: {
    I: "./steps_file.js",
    HomePage: "./pages/HomePage.js",
    ProductCatalogPage: "./pages/ProductCatalogPage.js",
    ProductDetailsPage: "./pages/ProductDetailsPage.js",
    CartPage: "./pages/CartPage.js",
    CheckoutPage: "./pages/CheckoutPage.js",
    RegisterPage: "./pages/RegisterPage.js",
    ConfirmationPage: "./pages/ConfirmationPage.js",
    SignInPage: "./pages/SignInPage.js",
    Navigation: "./components/Navigation.js",
  },
  // Plugins
  plugins: {
    allure: {
      enabled: true,
      require: "@codeceptjs/allure-legacy",
      outputDir: "allure-results", // Directory where Allure results will be stored
    },
  },

  // Disable problematic features
  bootstrap: null,
  mocha: {
    // Add timeout configuration
    timeout: 60000,
  },
  name: "henckels-automation",
  plugins: {
    screenshotOnFail: {
      enabled: true,
    },
    allure: {
      enabled: true,
      require: "allure-codeceptjs",
    },
    retryFailedStep: {
      enabled: false, // Disable default retry
      retries: 2,
    },
    tryTo: {
      enabled: false, // Disable the deprecated plugin
    },
  },
  multiple: {
    parallel: {
      chunks: parseInt(process.env.CHUNKS) || 1,
      browsers: ["chromium"],
    },
    multi_device: {
      browsers: [
        {
          browser: "chromium",
          windowSize: "1920x1080",
        },
        {
          browser: "chromium",
          windowSize: "1366x768",
        },
        {
          browser: "chromium",
          windowSize: "375x667", // Mobile
        },
      ],
    },
  },
};

function getWindowSize() {
  const size = process.env.SCREEN_SIZE || "desktop";
  const sizes = {
    //desktop: "2560x1440",
    desktop: "1440x900",
    tablet: "1024x768",
    mobile: "375x667",
  };
  return sizes[size] || sizes.desktop;
}

function getBaseUrl() {
  const urls = {
    next: "https://next.henckels.io",
    staging: "https://staging.henckels.io",
    prod: "https://www.henckels.com",
  };
  return urls[ENV] || urls.prod;
}
