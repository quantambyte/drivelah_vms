"use strict";
const PromotionService = require("../services/promotion");
const { validationResult } = require("express-validator");
const AppError = require("../utils/AppError");

class PromotionController {
  static async createPromotion(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new AppError(
          `Promotion Creation Validation failed. errors:${JSON.stringify(
            errors
          )}`,
          400
        )
      );
    }
    try {
      const promotionData = req.body;
      const newPromotion = await PromotionService.createPromotion(
        promotionData
      );
      return res.status(201).json({ success: true, data: newPromotion });
    } catch (error) {
      return next(
        new AppError(`Failed to create promotion. error:${error}`, 500)
      );
    }
  }

  static async getAllPromotions(req, res, next) {
    try {
      const promotions = await PromotionService.getAllPromotions();
      return res.status(200).json({ success: true, data: promotions });
    } catch (error) {
      return next(
        new AppError(`Failed to retrieve promotions. error:${error}`, 500)
      );
    }
  }

  static async getPromotionById(req, res, next) {
    try {
      const promotionId = req.params.id;
      const promotion = await PromotionService.getPromotionById(promotionId);
      if (!promotion) {
        return next(
          new AppError(`Promotion with id ${promotionId} not found`, 404)
        );
      }
      return res.status(200).json({ success: true, data: promotion });
    } catch (error) {
      return next(
        new AppError(
          `Failed to retrieve promotion with id ${promotionId}. error:${error}`,
          500
        )
      );
    }
  }

  static async updatePromotion(req, res, next) {
    const promotionId = req.params.id;
    const updatedData = req.body;
    try {
      const updatedPromotion = await PromotionService.updatePromotion(
        promotionId,
        updatedData
      );
      if (!updatedPromotion) {
        return next(
          new AppError(`Promotion with id ${promotionId} not found`, 404)
        );
      }
      return res.status(200).json({ success: true, data: updatedPromotion });
    } catch (error) {
      return next(
        new AppError(
          `Failed to update promotion with id ${promotionId}. error: ${error}`,
          500
        )
      );
    }
  }

  static async deletePromotion(req, res, next) {
    const promotionId = req.params.id;
    try {
      const deletedPromotion = await PromotionService.deletePromotion(
        promotionId
      );
      if (!deletedPromotion) {
        return next(
          new AppError(`Promotion with id ${promotionId}not found`, 404)
        );
      }
      return res
        .status(200)
        .json({ success: true, message: "Promotion deleted successfully" });
    } catch (error) {
      return next(
        new AppError(
          `Failed to delete promotion with id ${promotionId}. error: ${error}`,
          500
        )
      );
    }
  }
}

module.exports = PromotionController;
