"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("vouchers", [
      {
        voucherCode: "SAVE10",
        discountType: "percentage",
        discountValue: 10,
        expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // valid for 7 days
        usageLimit: 100,
        minimumOrderValue: 50,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("vouchers", null, {});
  },
};
