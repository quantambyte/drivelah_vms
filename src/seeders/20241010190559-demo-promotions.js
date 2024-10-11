"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("promotions", [
      {
        promoCode: "PROMO20",
        eligibleCategories: JSON.stringify(["food and beverage"]),
        discountType: "fixed",
        discountValue: 20,
        expirationDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // valid for 14 days
        usageLimit: 50,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("promotions", null, {});
  },
};
