const faker = require("faker");

faker.locale = "sv";
console.log(faker.commerce.productName());