const { faker } = require("@faker-js/faker");
const Helper = require("@codeceptjs/helper");

class DataHelper extends Helper {
  // In steps_file.js or DataHelper
  generateShippingData(overrides = {}) {
    const defaultData = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: "automationhenckels@gmail.com",
      //`test+${Date.now()}@example.com`,
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state({ abbreviated: false }),
      zip: faker.location.zipCode(),
      country: "United States",
      phone: "18147313801",
      //faker.phone.number("###-###-####"),
    };

    return { ...defaultData, ...overrides };
  }

  generateUserData(overrides = {}) {
    const randomNumber = Date.now() + Math.floor(Math.random() * 1000);

    const defaultData = {
      email: `automationhenckels+${randomNumber}@gmail.com`,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      password: this.generateSecurePassword(),
    };

    //console.log("Generated user data:", defaultData);
    return { ...defaultData, ...overrides };
  }

  generateSecurePassword(length = 12) {
    // Ensure minimum length of 8
    const minLength = Math.max(length, 8);

    // Character sets
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const specialChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    // Ensure at least one character from each required set
    let password = "";
    password += this.getRandomChar(uppercase); // At least 1 uppercase
    password += this.getRandomChar(lowercase); // At least 1 lowercase
    password += this.getRandomChar(numbers); // At least 1 number
    password += this.getRandomChar(specialChars); // At least 1 special char

    // Fill remaining length with random characters from all sets
    const allChars = uppercase + lowercase + numbers + specialChars;
    for (let i = password.length; i < minLength; i++) {
      password += this.getRandomChar(allChars);
    }

    // Shuffle the password to randomize character positions
    password = this.shuffleString(password);

    //console.log("🔒 Generated secure password:", password);
    return password;
  }
  getRandomChar(str) {
    return str.charAt(Math.floor(Math.random() * str.length));
  }

  shuffleString(str) {
    return str
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");
  }
}

module.exports = DataHelper;
