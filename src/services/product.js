"use strict";
const { Product } = require("../models");
const AppError = require("../utils/AppError");
const { Op } = require("sequelize");

class ProductService {
  static async createProduct(productData) {
    return await Product.create(productData);
  }

  static async getAllProducts() {
    return await Product.findAll();
  }

  static async getProductById(productId) {
    return await Product.findByPk(productId);
  }

  static async updateProduct(productId, updatedData) {
    const product = await Product.findByPk(productId);
    if (!product) {
      return null;
    }
    await product.update(updatedData);
    return product;
  }

  static async deleteProduct(productId) {
    const product = await Product.findByPk(productId);
    if (!product) {
      return null;
    }
    await product.destroy();
    return product;
  }

  static async reduceProductStock(productId, quantity, transaction) {
    try {
      const product = await Product.findOne({
        where: { id: productId },
      });

      if (!product) {
        throw new AppError(`Product with ID ${productId} not found.`, 404);
      }

      product.stock -= quantity;

      if (product.stock < 0) {
        throw new AppError(
          `Insufficient stock for product with ID ${productId}.`,
          400
        );
      }

      await product.save({ transaction });
    } catch (error) {
      throw new AppError(
        `Something went wrong while reducing the stock for product ${productId}. error: ${error}`,
        500
      );
    }
  }

  static async getProductsByIds(productIds) {
    return await Product.findAll({
      where: {
        id: {
          [Op.in]: productIds,
        },
      },
    });
  }
}

module.exports = ProductService;
