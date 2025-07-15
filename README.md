# Henckels Automation

End-to-end test automation suite for the Henckels e-commerce platform, built with [CodeceptJS](https://codecept.io/) and [Playwright](https://playwright.dev/). This project covers checkout flows, payment methods, promo codes, and more, with support for multi-device and multi-environment testing.

---

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Usage](#usage)
- [Test Structure](#test-structure)
- [Environment Variables](#environment-variables)
- [Reporting](#reporting)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- Page Object Model for maintainable test code
- Multi-environment support (`next`, `staging`, `prod`)
- Multi-device/browser testing (desktop, tablet, mobile)
- Allure reporting integration
- Email and data helpers (MailSlurp, Faker)
- Docker support for CI/CD

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) (optional, for containerized runs)
- MailSlurp account (for email testing)

---

## Setup

1. **Clone the repository:**

   ```sh
   git clone https://github.com/your-org/henckels-automation.git
   cd henckels-automation/henckels-automation
   ```

2. **Install dependencies:**

   ```sh
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables:**

   Copy `.env.example` to `.env` and fill in the required values:

   ```sh
   cp .env.example .env
   ```

   Example `.env` values:
   ```
   NODE_ENV=staging
   HEADLESS=true
   BROWSER=chromium
   MAILSLURP_API_KEY=your-mailslurp-api-key
   ```

---

## Usage

### Running Tests

- **Smoke tests:**
  ```sh
  npm run test:smoke
  ```

- **Regression tests:**
  ```sh
  npm run test:regression
  ```

- **Environment-specific:**
  ```sh
  npm run test:next
  npm run test:staging
  npm run test:prod
  ```

- **Device-specific:**
  ```sh
  npm run test:mobile
  npm run test:tablet
  npm run test:desktop
  ```

- **Parallel execution:**
  ```sh
  npm run test:parallel
  ```

- **Multi-device execution:**
  ```sh
  npm run test:multi-device
  ```

- **Headless mode:**
  ```sh
  npm run test:headless
  ```

- **Dockerized run:**
  ```sh
  npm run test:docker
  ```

### Allure Reporting

- **Generate report:**
  ```sh
  npm run report:generate
  ```

- **Open report:**
  ```sh
  npm run report:open
  ```

---

## Test Structure

- `pages/` — Page Object Models (e.g., `CheckoutPage.js`)
- `tests/` — Test suites (`*_test.js`)
- `helpers/` — Custom helpers (e.g., `DataHelper.js`, `MailSlurpHelper.js`)
- `components/` — Shared UI components
- `output/` — Test artifacts (screenshots, logs)
- `allure-results/` — Allure raw results

---

## Environment Variables

Set these in your `.env` file:

| Variable           | Description                        |
|--------------------|------------------------------------|
| NODE_ENV           | Test environment (`next`, `staging`, `prod`) |
| HEADLESS           | Run browser in headless mode (`true`/`false`) |
| BROWSER            | Browser to use (`chromium`, `firefox`, `webkit`) |
| SCREEN_SIZE        | Device size (`desktop`, `tablet`, `mobile`) |
| MAILSLURP_API_KEY  | API key for MailSlurp email testing |

---

## Contributing

1. **Fork the repository**
2. **Create a new branch**  
   `git checkout -b feature/your-feature`
3. **Make your changes**
4. **Write or update tests**
5. **Run tests locally**  
   `npm test`
6. **Commit and push**  
   `git commit -m "Describe your change"`  
   `git push origin feature/your-feature`
7. **Open a Pull Request** on GitHub

**Code style:**  
- Follow existing patterns and naming conventions.
- Use async/await for asynchronous operations.
- Prefer data-test or data-testid attributes for selectors.

---