const { faker } = require("@faker-js/faker")

;("use strict")
// Return an extended actor with custom methods
module.exports = function () {
  return actor({
    async createTestInbox(name = "default") {
      const inbox = await this.createInbox(name)
      console.log(`Created inbox: ${inbox.emailAddress}`)
      return inbox
    },

    async waitForEmailAndGetContent(inboxId, timeout = 30000) {
      const email = await I.waitForEmail(inboxId, timeout)
      const emailContent = await I.getEmailContent(email.id)
      return emailContent
    },

    async getVerificationLinkFromEmail(emailContent) {
      const link = I.extractVerificationLink(emailContent.body)
      if (!link) {
        throw new Error("No verification link found in email")
      }
      return link
    },

    async getVerificationCodeFromEmail(emailContent) {
      const code = I.extractVerificationCode(emailContent.body)
      if (!code) {
        throw new Error("No verification code found in email")
      }
      return code
    },

    async handleProdAccessControl() {
      //console.log("🔐 Checking for Prod Access Control modal...");

      try {
        // Use grabNumberOfVisibleElements - this won't throw
        const modalCount = await this.grabNumberOfVisibleElements(
          '//h2[contains(text(), "Prod Access Control")] | //div[contains(text(), "Prod Access Control")]'
        )

        if (modalCount === 0) {
          return false
        }

        // Get password from environment variable
        const password = process.env.HENCKELS_PROD_PASSWORD

        if (!password) {
          return false
        }

        // Fill password and submit
        this.fillField('//input[@name="password"]', password)
        this.click(
          '//button[@type="submit"] | //button[contains(text(), "Submit")]'
        )

        // Wait for modal to disappear
        this.waitForInvisible(
          '//h1[contains(text(), "Prod Access Control")]',
          5
        )
        //console.log("✅ Prod Access Control modal handled successfully");

        this.wait(2) // Wait for page to load after authentication
        return true
      } catch (error) {
        return false
      }
    },

    async handleSelectCountryModal() {
      this.wait(1) // Wait for modal to appear
      try {
        // Use grabNumberOfVisibleElements - this won't throw
        const modalCount = await this.grabNumberOfVisibleElements(
          '[data-sentry-element="DialogContent"]'
        )

        if (modalCount === 0) {
          return false
        }

        this.click('[alt="Canada-flag"]')
        // Wait for modal to disappear
        this.waitForInvisible('[data-sentry-element="DialogContent"]', 5)

        this.wait(2) // Wait for page to load after authentication
        return true
      } catch (error) {
        return false
      }
    },

    async handleAllModals() {
      // Handle Prod Access Control first (if present)
      await this.handleProdAccessControl()
      await this.handleSelectCountryModal()
      // Then handle Privacy modal
      await this.handleUsercentricModal()
    },

    async handleUsercentricModalWithWait() {
      //console.log("🔒 Waiting for Usercentrics modal...");

      try {
        // Use 'this' instead of 'I' in custom methods
        this.waitForElement("#usercentrics-cmp-ui", 10)
        //console.log("Modal container found, checking for shadow DOM...");

        // Wait a bit more for shadow DOM to initialize
        this.wait(2)

        // Now try to click using executeScript
        const result = await this.executeScript(() => {
          const modal = document.querySelector("#usercentrics-cmp-ui")

          if (!modal) {
            return { error: "Modal not found" }
          }

          if (!modal.shadowRoot) {
            return { error: "Shadow root not found" }
          }

          // From the DOM structure we saw, try the exact button
          const acceptButton = modal.shadowRoot.querySelector(
            'button[data-testid="uc-accept-all-button"]'
          )

          if (acceptButton) {
            acceptButton.click()
            return { success: true, method: "data-testid" }
          }

          // Fallback to ID
          const acceptById = modal.shadowRoot.querySelector("button#accept")
          if (acceptById) {
            acceptById.click()
            return { success: true, method: "id" }
          }

          return { error: "Accept button not found" }
        })

        if (result.success) {
          this.wait(2)
          return true
        } else {
          return false
        }
      } catch (error) {
        return false
      }
    },

    async handleUsercentricModal() {
      // console.log(
      //   "🔒 Handling Usercentrics privacy modal with executeScript..."
      // );
      await this.waitForElement("#usercentrics-cmp-ui", 10)
      const handled = await this.executeScript(() => {
        // Use 'this' instead of 'I'
        // Find the shadow host

        const modal = document.querySelector("#usercentrics-cmp-ui")
        if (modal && modal.shadowRoot) {
          console.log("Found Usercentrics modal with shadow root")

          // Try to find the accept button using the selectors we saw in DOM
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
              //console.log("Found accept button with selector:", selector);
              button.click()
              return { success: true, selector: selector }
            }
          }

          // Fallback: find any button with "ACCEPT" text
          const allButtons = modal.shadowRoot.querySelectorAll("button")
          for (const button of allButtons) {
            if (
              button.textContent.includes("ACCEPT") ||
              button.getAttribute("aria-label")?.includes("ACCEPT")
            ) {
              //console.log("Found accept button by text content");
              button.click()
              return { success: true, selector: "text-based" }
            }
          }

          return { success: false, error: "Button not found in shadow DOM" }
        }

        return { success: false, error: "Modal or shadow root not found" }
      })

      if (handled.success) {
        this.wait(2) // Use 'this' instead of 'I'
        return true
      } else {
        return false
      }
    },

    async inspectCurrentPage() {
      const url = await this.grabCurrentUrl()
      const title = await this.grabTitle()

      console.log("\n=== Current Page Inspection ===")
      console.log("URL:", url)
      console.log("Title:", title)

      return { url, title }
    },
  })
}
