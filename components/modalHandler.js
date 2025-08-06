const { I } = inject()

/**
 * Modal Handler - Professional approach with Locate Builder pattern
 * Uses same pattern as CheckoutPage for consistency
 */
class ModalHandler {
  constructor() {
    // Production Access Control locators
    this.prodAccessContainer = locate(
      '//h2[contains(text(), "Prod Access Control")] | //div[contains(text(), "Prod Access Control")]'
    ).as("Production Access Control Container")

    this.prodAccessPasswordInput = locate('//input[@name="password"]').as(
      "Production Access Password Input"
    )

    this.prodAccessSubmitButton = locate(
      '//button[@type="submit"] | //button[contains(text(), "Submit")]'
    ).as("Production Access Submit Button")

    this.prodAccessDismissSelector = locate(
      '//h1[contains(text(), "Prod Access Control")]'
    ).as("Production Access Dismiss Selector")

    // Country Selection locators
    this.countrySelectionContainer = locate(
      '[data-sentry-element="DialogContent"]'
    ).as("Country Selection Dialog Container")

    this.countrySelectionCanadaButton = locate('[alt="Canada-flag"]').as(
      "Canada Flag Button"
    )

    // Usercentrics Privacy locators
    this.usercentricsContainer = locate("#usercentrics-cmp-ui").as(
      "Usercentrics Privacy Modal Container"
    )
  }

  /**
   * Handle all modals - same working logic, professional structure
   */
  async handleAllModals() {
    //console.log("🔍 Checking for modals...")

    // Handle Production Access Control first (if present)
    await this.handleProdAccessControl()

    // Handle Country Selection modal
    await this.handleSelectCountryModal()

    // Handle Usercentrics modal
    await this.handleUsercentricModal()

    //console.log("✅ Modal handling complete")
  }

  /**
   * Handle Production Access Control - using locate builder
   */
  async handleProdAccessControl() {
    try {
      //console.log("🔐 Checking for Production Access Control modal...")

      const modalCount = await I.grabNumberOfVisibleElements(
        this.prodAccessContainer
      )

      if (modalCount === 0) {
        //console.log("➡️ Production Access Control modal not present - skipping")
        return false
      }

      // Get password from environment variable
      const password = process.env.HENCKELS_PROD_PASSWORD

      if (!password) {
        //console.log("⚠️ HENCKELS_PROD_PASSWORD not set - skipping")
        return false
      }

      //console.log("🔍 Found Production Access Control modal - handling it")

      // Fill password and submit using locate builder
      I.fillField(this.prodAccessPasswordInput, password)
      I.click(this.prodAccessSubmitButton)

      // Wait for modal to disappear
      I.waitForInvisible(this.prodAccessDismissSelector, 5)

      //console.log("✅ Production Access Control modal handled successfully")

      I.wait(2) // Wait for page to load after authentication
      return true
    } catch (error) {
      //console.log(
      //  `❌ Error handling Production Access Control: ${error.message}`
      //)
      return false
    }
  }

  /**
   * Handle Country Selection modal - using locate builder
   */
  async handleSelectCountryModal() {
    I.wait(1) // Wait for modal to appear

    try {
      //console.log("🌍 Checking for Country Selection modal...")

      const modalCount = await I.grabNumberOfVisibleElements(
        this.countrySelectionContainer
      )

      if (modalCount === 0) {
        //console.log("➡️ Country Selection modal not present - skipping")
        return false
      }

      //console.log("🔍 Found Country Selection modal - handling it")

      // Click Canada flag using locate builder
      I.click(this.countrySelectionCanadaButton)

      // Wait for modal to disappear
      I.waitForInvisible(this.countrySelectionContainer, 5)

      //console.log("✅ Country Selection modal handled successfully")

      I.wait(2) // Wait for page to load
      return true
    } catch (error) {
      //console.log(`❌ Error handling Country Selection modal: ${error.message}`)
      return false
    }
  }

  /**
   * Handle Usercentrics Privacy modal - using locate builder for container
   */
  async handleUsercentricModal() {
    try {
      //console.log("🔒 Checking for Usercentrics Privacy modal...")

      // Wait for modal using locate builder
      I.waitForElement(this.usercentricsContainer, 10)

      //console.log("🔍 Found Usercentrics Privacy modal - handling it")
      //console.log("Modal container found, checking for shadow DOM...")

      // Wait for shadow DOM to initialize
      I.wait(2)

      // Handle shadow DOM interaction
      const result = await I.executeScript(() => {
        const modal = document.querySelector("#usercentrics-cmp-ui")

        if (!modal) {
          return { error: "Modal not found" }
        }

        if (!modal.shadowRoot) {
          return { error: "Shadow root not found" }
        }

        //console.log("Found Usercentrics modal with shadow root")

        // Try to find the accept button using comprehensive selectors
        const selectors = [
          'button[data-testid="uc-accept-all-button"]',
          "button#accept",
          'button[aria-label="ACCEPT ALL"]',
          "button.accept.uc-accept-button",
          'button[data-action-type="accept"]',
        ]

        for (const selector of selectors) {
          const button = modal.shadowRoot.querySelector(selector)
          if (button) {
            //console.log("Found accept button with selector:", selector)
            button.click()
            return { success: true, method: selector }
          }
        }

        // Fallback: find any button with "ACCEPT" text
        const allButtons = modal.shadowRoot.querySelectorAll("button")
        for (const button of allButtons) {
          if (
            button.textContent.includes("ACCEPT") ||
            button.getAttribute("aria-label")?.includes("ACCEPT")
          ) {
            //console.log("Found accept button by text content")
            button.click()
            return { success: true, method: "text-based" }
          }
        }

        return { error: "Accept button not found" }
      })

      if (result.success) {
        //console.log("✅ Usercentrics Privacy modal handled successfully")
        I.wait(2)
        return true
      } else {
        //console.log(`⚠️ Could not handle Usercentrics modal: ${result.error}`)
        return false
      }
    } catch (error) {
      //console.log("➡️ Usercentrics Privacy modal not present - skipping")
      return false
    }
  }

  /**
   * Utility method to check if a specific modal is present
   * @param {string} modalType - 'prodAccess', 'countrySelection', or 'usercentrics'
   * @returns {boolean} - Whether the modal is currently visible
   */
  async isModalPresent(modalType) {
    let locator

    switch (modalType) {
      case "prodAccess":
        locator = this.prodAccessContainer
        break
      case "countrySelection":
        locator = this.countrySelectionContainer
        break
      case "usercentrics":
        locator = this.usercentricsContainer
        break
      default:
        throw new Error(`Unknown modal type: ${modalType}`)
    }

    try {
      const count = await I.grabNumberOfVisibleElements(locator)
      return count > 0
    } catch (error) {
      return false
    }
  }

  /**
   * Handle only specific modal by type
   * @param {string} modalType - 'prodAccess', 'countrySelection', or 'usercentrics'
   */
  async handleSpecificModal(modalType) {
    //console.log(`🔍 Handling specific modal: ${modalType}`)

    switch (modalType) {
      case "prodAccess":
        return await this.handleProdAccessControl()
      case "countrySelection":
        return await this.handleSelectCountryModal()
      case "usercentrics":
        return await this.handleUsercentricModal()
      default:
        throw new Error(`Unknown modal type: ${modalType}`)
    }
  }
}

module.exports = new ModalHandler()
