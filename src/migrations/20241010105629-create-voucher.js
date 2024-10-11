"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("vouchers", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      voucherCode: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },
      discountType: {
        type: Sequelize.ENUM("percentage", "fixed"),
        allowNull: false,
      },
      discountValue: {
        type: Sequelize.FLOAT,
        allowNull: false,
        validate: {
          isFloat: true,
          min: 0,
        },
      },
      expirationDate: {
        type: Sequelize.DATE,
        allowNull: false,
        validate: {
          isDate: true,
          isAfter: new Date().toISOString(),
        },
      },
      usageLimit: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          isInt: true,
          min: 1,
        },
      },
      minimumOrderValue: {
        type: Sequelize.FLOAT,
        allowNull: true,
        validate: {
          isFloat: true,
          min: 0,
        },
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("vouchers");
  },
};
