"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("products", [
      {
        productName: "Product A",
        productCategory: "digital services",
        price: 29.99,
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productName: "Product B",
        productCategory: "cosmetics and body care",
        price: 15.5,
        stock: 200,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("products", null, {});
  },
};
