"use strict";
const { Promotion } = require("../models");
const AppError = require("../utils/AppError");
const { Op } = require("sequelize");

class PromotionService {
  static async createPromotion(data) {
    return await Promotion.create(data);
  }

  static async getAllPromotions() {
    return await Promotion.findAll();
  }

  static async getPromotionById(promotionId) {
    return await Promotion.findByPk(promotionId);
  }

  static async getPromotionByCode(promotionCode) {
    return await Promotion.findOne({
      where: {
        promoCode: promotionCode,
        expirationDate: {
          [Op.gt]: new Date(),
        },
        usageLimit: {
          [Op.gt]: 0,
        },
      },
    });
  }

  static async updatePromotion(id, data) {
    const promotion = await Promotion.findByPk(id);
    if (!promotion) {
      throw new AppError(`Promotion with id ${id} not found`, 404);
    }
    return await promotion.update(data);
  }

  static async deletePromotion(id) {
    const promotion = await Promotion.findByPk(id);
    if (!promotion) {
      throw new AppError(`Promotion id ${id} not found`, 404);
    }
    await promotion.destroy();
    return { message: "Promotion deleted successfully" };
  }
}

module.exports = PromotionService;
