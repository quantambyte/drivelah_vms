"use strict";
const { OrderProduct } = require("../models");
const AppError = require("../utils/AppError");

class OrderProductService {
  static async createOrderProducts(orderProductsData, transaction) {
    try {
      return await OrderProduct.bulkCreate(orderProductsData, { transaction });
    } catch (error) {
      throw new AppError(
        `Failed to bulk create order products. error: ${error}`,
        500
      );
    }
  }

  static async getOrderProductsByOrderId(orderId) {
    try {
      return await OrderProduct.findAll({ where: { orderId } });
    } catch (error) {
      throw new AppError(
        `Failed to get order products by order ID ${orderId}. error: ${error}`,
        500
      );
    }
  }

  static async updateOrderProductsByOrderId(
    orderId,
    orderProductsData,
    transaction
  ) {
    try {
      await OrderProduct.destroy({ where: { orderId }, transaction });
      return await this.createOrderProducts(orderProductsData, transaction);
    } catch (error) {
      throw new AppError(
        `Failed to update order products by order ID ${orderId}. error: ${error}`,
        500
      );
    }
  }
}

module.exports = OrderProductService;
