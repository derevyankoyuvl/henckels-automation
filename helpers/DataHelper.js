const { faker } = require("@faker-js/faker")
const Helper = require("@codeceptjs/helper")

class DataHelper extends Helper {
  // In steps_file.js or DataHelper
  // generateShippingData(overrides = {}) {
  //   const defaultData = {
  //     firstName: faker.person.firstName(),
  //     lastName: faker.person.lastName(),
  //     email: "automationhenckels@gmail.com",
  //     //`test+${Date.now()}@example.com`,
  //     address: faker.location.streetAddress(),
  //     city: faker.location.city(),
  //     state: faker.location.state({ abbreviated: false }),
  //     zip: faker.location.zipCode(),
  //     country: "United States",
  //     phone: "18147313801",
  //     //faker.phone.number("###-###-####"),
  //   }

  //   return { ...defaultData, ...overrides }
  // }

  // Helper function to generate valid Canadian postal codes
 generateValidCanadianPostalCode() {
  // Valid letters for Canadian postal codes (excluding D, F, I, O, Q, U)
  const validLetters = 'ABCEGHIJKLMNPRSTUVWXYZ'.split('');
  // First letter cannot be W or Z
  const firstLetterValid = 'ABCEGHIJKLMNPRSTUV'.split('');
  
  const firstLetter = faker.helpers.arrayElement(firstLetterValid);
  const firstDigit = faker.number.int({ min: 0, max: 9 })
  const secondLetter = faker.helpers.arrayElement(validLetters);
  const secondDigit = faker.number.int({ min: 0, max: 9 })
  const thirdLetter = faker.helpers.arrayElement(validLetters);
  const thirdDigit = faker.number.int({ min: 0, max: 9 })
  
  return `${firstLetter}${firstDigit}${secondLetter} ${secondDigit}${thirdLetter}${thirdDigit}`;
}

  generateShippingData(overrides = {}) {
    // Get country from environment variable, default to 'us'
    const countryCode = process.env.COUNTRY || "us"

    let locationData

    switch (countryCode.toLowerCase()) {
      case "ca":
        // Canadian data
        const canadianProvinces = [
          "Alberta",
          "British Columbia",
          "Manitoba",
          "New Brunswick",
          "Newfoundland and Labrador",
          "Northwest Territories",
          "Nova Scotia",
          "Nunavut",
          "Ontario",
          "Prince Edward Island",
          "Quebec",
          "Saskatchewan",
          "Yukon",
        ]

        locationData = {
          address: faker.location.streetAddress(),
          city: faker.location.city(),
          state: faker.helpers.arrayElement(canadianProvinces),
          zip: this.generateValidCanadianPostalCode(),
          country: "Canada",
        }
        break

      case "de":
        // German data
        const germanStates = [
          "Baden-Württemberg",
          "Bayern",
          "Berlin",
          "Brandenburg",
          "Bremen",
          "Hamburg",
          "Hessen",
          "Mecklenburg-Vorpommern",
          "Niedersachsen",
          "Nordrhein-Westfalen",
          "Rheinland-Pfalz",
          "Saarland",
          "Sachsen",
          "Sachsen-Anhalt",
          "Schleswig-Holstein",
          "Thüringen",
        ]

        locationData = {
          address: faker.location.streetAddress(),
          city: faker.location.city(),
          state: faker.helpers.arrayElement(germanStates),
          zip: faker.location.zipCode("#####"), // German postal code: 5 digits
          country: "Germany",
        }
        break

      case "us":
      default:
        // US data (default)
        locationData = {
          address: faker.location.streetAddress(),
          city: faker.location.city(),
          state: faker.location.state({ abbreviated: false }),
          zip: faker.location.zipCode(),
          country: "United States",
        }
        break
    }

    const defaultData = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: "automationhenckels@gmail.com",
      phone: "18147313801", // You might want to localize this too
      ...locationData,
    }

    return { ...defaultData, ...overrides }
  }

  generateUserData(overrides = {}) {
    const randomNumber = Date.now() + Math.floor(Math.random() * 1000)

    const defaultData = {
      email: `automationhenckels+${randomNumber}@gmail.com`,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      password: this.generateSecurePassword(),
    }

    //console.log("Generated user data:", defaultData);
    return { ...defaultData, ...overrides }
  }

  generateSecurePassword(length = 12) {
    // Ensure minimum length of 8
    const minLength = Math.max(length, 8)

    // Character sets
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const lowercase = "abcdefghijklmnopqrstuvwxyz"
    const numbers = "0123456789"
    const specialChars = "!@#$%^&*()_+-=[]{}|;:,.<>?"

    // Ensure at least one character from each required set
    let password = ""
    password += this.getRandomChar(uppercase) // At least 1 uppercase
    password += this.getRandomChar(lowercase) // At least 1 lowercase
    password += this.getRandomChar(numbers) // At least 1 number
    password += this.getRandomChar(specialChars) // At least 1 special char

    // Fill remaining length with random characters from all sets
    const allChars = uppercase + lowercase + numbers + specialChars
    for (let i = password.length; i < minLength; i++) {
      password += this.getRandomChar(allChars)
    }

    // Shuffle the password to randomize character positions
    password = this.shuffleString(password)

    //console.log("🔒 Generated secure password:", password);
    return password
  }
  getRandomChar(str) {
    return str.charAt(Math.floor(Math.random() * str.length))
  }

  shuffleString(str) {
    return str
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("")
  }
}

module.exports = DataHelper
