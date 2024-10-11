"use strict";
const { Order, Voucher, Promotion } = require("../models");
const { Op } = require("sequelize");
const AppError = require("../utils/AppError");
const VoucherService = require("./voucher");
const PromotionService = require("./promotion");

class OrderService {
  static async createOrder(orderData, transaction) {
    return await Order.create(orderData, { transaction });
  }

  static async getAllOrders() {
    return await Order.findAll();
  }

  static async getOrderById(orderId) {
    return await Order.findByPk(orderId);
  }

  static async updateOrder(orderId, updatedData) {
    const order = await Order.findByPk(orderId);
    if (!order) {
      return null;
    }
    await order.update(updatedData);
    return order;
  }

  static async deleteOrder(orderId) {
    const order = await Order.findByPk(orderId);
    if (!order) {
      return null;
    }
    await order.destroy();
    return order;
  }

  static async applyDiscount(orderId, discountType, discountId) {
    const order = await this.getOrderById(orderId);
    if (!order) throw new AppError(`Order with id ${orderId} not found`, 404);

    let discountValue = 0;

    if (discountType === "voucher") {
      const voucher = await Voucher.findOne({
        where: {
          id: discountId,
          isActive: true,
          expirationDate: { [Op.gte]: new Date() },
        },
      });

      if (!voucher) throw new AppError("Invalid or expired voucher", 400);

      if (order.totalPrice < voucher.minimumOrderValue) {
        throw new AppError(
          `Minimum order value for this voucher is ${voucher.minimumOrderValue}`,
          400
        );
      }

      discountValue =
        voucher.discountType === "percentage"
          ? (order.totalPrice * voucher.discountValue) / 100
          : voucher.discountValue;
    } else if (discountType === "promotion") {
      const promotion = await Promotion.findOne({
        where: {
          id: discountId,
          isActive: true,
          expirationDate: { [Op.gte]: new Date() },
        },
      });

      if (!promotion) throw new AppError("Invalid or expired promotion", 400);

      discountValue =
        promotion.discountType === "percentage"
          ? (order.totalPrice * promotion.discountValue) / 100
          : promotion.discountValue;
    }

    // Enforce a maximum discount limit of 50% of the total price
    const maxDiscount = order.totalPrice * 0.5;
    if (discountValue > maxDiscount) {
      discountValue = maxDiscount;
    }

    // Update the order's total price after applying the discount
    order.totalPrice -= discountValue;
    await order.save();

    return order;
  }

  static async calculateDiscount(
    totalOrderPrice,
    discountType,
    discountCode,
    products
  ) {
    let discountObj;
    let totalPriceAfterDiscount = totalOrderPrice;
    try {
      if (discountType === "voucher") {
        discountObj = await VoucherService.getVoucherByCode(
          discountCode,
          totalOrderPrice
        );
        if (!discountObj) {
          return new AppError(
            `Valid Voucher with code ${discountCode} not found while applying discount to order.`,
            404
          );
        }

        const {
          discountType: discountObjType,
          discountValue: discountObjValue,
        } = discountObj;

        if (discountObjType === "fixed") {
          totalPriceAfterDiscount = totalOrderPrice - discountObjValue;
          if (totalPriceAfterDiscount < 0) {
            totalPriceAfterDiscount = 0;
          }
        } else if (discountObjType === "percentage") {
          const discountAmount = (totalOrderPrice * discountObjValue) / 100;
          totalPriceAfterDiscount = totalOrderPrice - discountAmount;
          const maxAllowedDiscount = totalOrderPrice * 0.5;
          if (discountAmount > maxAllowedDiscount) {
            totalPriceAfterDiscount = totalOrderPrice - maxAllowedDiscount;
          }
        }
        discountObj.usageLimit -= 1;
      } else if (discountType === "promotion") {
        discountObj = await PromotionService.getPromotionByCode(discountCode);
        if (!discountObj) {
          return new AppError(
            `Valid Promotion with code ${discountCode} not found while applying discount to order`,
            404
          );
        }

        const eligibleCategories = discountObj.eligibleCategories;
        const orderProductCategories = products.map((p) => p.productCategory);

        const isApplicable = orderProductCategories.some((category) =>
          eligibleCategories.includes(category)
        );

        if (!isApplicable) {
          return new AppError(
            `Promotion is not applicable to the products in the current order`,
            400
          );
        }

        const eligibleDiscountType = discountObj.discountType;
        const eligibleDiscountValue = discountObj.discountValue;

        if (eligibleDiscountType === "fixed") {
          totalPriceAfterDiscount = totalOrderPrice - eligibleDiscountValue;
          if (totalPriceAfterDiscount < 0) {
            totalPriceAfterDiscount = 0;
          }
        } else if (eligibleDiscountType === "percentage") {
          const discountAmount =
            (totalOrderPrice * eligibleDiscountValue) / 100;
          totalPriceAfterDiscount = totalOrderPrice - discountAmount;
          const maxAllowedDiscount = totalOrderPrice * 0.5;
          if (discountAmount > maxAllowedDiscount) {
            totalPriceAfterDiscount = totalOrderPrice - maxAllowedDiscount;
          }
        }
        discountObj.usageLimit -= 1;
      }
      return {
        discountObj,
        totalPriceAfterDiscount,
      };
    } catch (error) {
      throw new AppError(
        `Something went wrong while calculating the discount. error: ${error}`,
        500
      );
    }
  }
}

module.exports = OrderService;
