// File: helpers/OrderDetailsHelper.js
const { Helper } = require("codeceptjs")
const fs = require("fs")
const path = require("path")

class OrderDetailsHelper extends Helper {
  constructor(config) {
    super(config)
    this.outputDir = config.outputDir || global.output_dir || "./output"
    this.orderNumbersFile = path.join(this.outputDir, "order_numbers.txt")
    console.log(
      "OrderDetailsHelper initialized with output dir:",
      this.outputDir
    )
  }

  // CodeceptJS hook - called before test suite
  _beforeSuite() {
    console.log("OrderDetailsHelper: beforeSuite hook called")
    this.clearOrderNumbersFile()

    // Make the helper methods available globally
    global.orderNumberManager = {
      saveOrderDetails: (orderDetails, testName) => {
        this.saveOrderDetails(orderDetails, testName)
      },
      clearOrderNumbersFile: () => {
        this.clearOrderNumbersFile()
      },
      getAllOrderNumbers: () => {
        return this.getAllOrderNumbers()
      },
    }
  }

  // Clear the order numbers file (called at start of test suite)
  clearOrderNumbersFile() {
    try {
      if (fs.existsSync(this.orderNumbersFile)) {
        fs.unlinkSync(this.orderNumbersFile)
        console.log("Previous order numbers file cleared")
      }
    } catch (error) {
      console.error("Error clearing order numbers file:", error)
    }
  }

  // Save order details to file (append mode)
  saveOrderDetails(orderDetails, testName = "") {
    try {
      console.log("🔄 Saving order details via helper...")

      // Ensure output directory exists
      if (!fs.existsSync(this.outputDir)) {
        console.log("Creating output directory:", this.outputDir)
        fs.mkdirSync(this.outputDir, { recursive: true })
      }

      const timestamp = new Date().toISOString()
      const orderEntry =
        `${timestamp} - Test: ${testName}\n` +
        `  Order Number: ${orderDetails.orderNumber}\n` +
        `  Order Date: ${orderDetails.orderDate}\n` +
        `  Order Status: ${orderDetails.orderStatus}\n` +
        `  Order Total: ${orderDetails.orderTotal}\n` +
        `${"=".repeat(60)}\n`

      fs.appendFileSync(this.orderNumbersFile, orderEntry)
    } catch (error) {
      console.error("❌ Error saving order details:", error)
    }
  }

  // Legacy method for backward compatibility
  saveOrderNumber(orderNumber, testName = "") {
    this.saveOrderDetails(
      {
        orderNumber,
        orderDate: "N/A",
        orderStatus: "N/A",
        orderTotal: "N/A",
      },
      testName
    )
  }

  // Get all saved order numbers
  getAllOrderNumbers() {
    try {
      if (fs.existsSync(this.orderNumbersFile)) {
        return fs.readFileSync(this.orderNumbersFile, "utf8")
      }
      return ""
    } catch (error) {
      console.error("Error reading order numbers file:", error)
      return ""
    }
  }
}

module.exports = OrderDetailsHelper
