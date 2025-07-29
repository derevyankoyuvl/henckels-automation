class ScreenshotHelper extends Helper {
  async takeScreenshotOnFailure() {
    const helper = this.helpers["Playwright"]
    await helper.saveScreenshot(`failure_${Date.now()}.png`)
  }

  async compareScreenshot(name) {
    const helper = this.helpers["Playwright"]
    // Implement visual comparison logic
    await helper.saveScreenshot(`${name}_${Date.now()}.png`)
  }
}

module.exports = ScreenshotHelper
