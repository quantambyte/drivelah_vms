"use strict";

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "Product",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      productName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      productCategory: {
        type: DataTypes.ENUM(
          "digital services",
          "cosmetics and body care",
          "food and beverage",
          "furniture and decor",
          "health and wellness",
          "household items",
          "media",
          "pet care",
          "office equipment"
        ),
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          isFloat: true,
          min: 0,
        },
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: true,
          min: 0,
        },
      },
    },
    {
      tableName: "products",
      timestamps: true,
    }
  );

  Product.associate = (models) => {
    Product.belongsToMany(models.Order, {
      through: "order_products",
      foreignKey: "productId",
      otherKey: "orderId",
      onDelete: "CASCADE",
    });
  };

  return Product;
};
