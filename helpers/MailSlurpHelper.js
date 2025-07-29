const { Helper } = require("codeceptjs")
const { MailSlurp } = require("mailslurp-client")

class MailSlurpHelper extends Helper {
  constructor(config) {
    super(config)
    this.mailslurp = new MailSlurp({ apiKey: process.env.MAILSLURP_API_KEY })
    this.inboxes = new Map()
  }

  async createInbox(name = "test-inbox") {
    const inbox = await this.mailslurp.createInbox()
    this.inboxes.set(name, inbox)
    return inbox
  }

  async getInbox(name) {
    return this.inboxes.get(name)
  }

  async waitForEmail(inboxId, timeout = 30000) {
    return await this.mailslurp.waitForLatestEmail(inboxId, timeout)
  }

  async getEmails(inboxId) {
    return await this.mailslurp.getEmails(inboxId)
  }

  async deleteInbox(inboxId) {
    return await this.mailslurp.deleteInbox(inboxId)
  }

  async getEmailContent(emailId) {
    return await this.mailslurp.getEmail(emailId)
  }
  // Helper method to extract verification links
  extractVerificationLink(emailBody) {
    const linkRegex = /https?:\/\/[^\s<>"]+/g
    const links = emailBody.match(linkRegex)
    return links
      ? links.find(
          (link) =>
            link.includes("verify") ||
            link.includes("confirm") ||
            link.includes("activate")
        )
      : null
  }

  // Helper method to extract verification codes
  extractVerificationCode(emailBody) {
    const codeRegex = /\b\d{4,8}\b/g
    const matches = emailBody.match(codeRegex)
    return matches ? matches[0] : null
  }
}

module.exports = MailSlurpHelper
