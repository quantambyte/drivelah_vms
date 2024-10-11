"use strict";
const bcrypt = require("bcrypt");
module.exports = {
  async up(queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt(10);
    const password1 = await bcrypt.hash("password1", salt);
    const password2 = await bcrypt.hash("password2", salt);
    await queryInterface.bulkInsert("users", [
      {
        userName: "JohnDoe",
        userEmail: "john@example.com",
        userPassword: password1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userName: "JaneDoe",
        userEmail: "jane@example.com",
        userPassword: password2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
