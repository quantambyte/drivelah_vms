"use strict";
const express = require("express");
const { body, param } = require("express-validator");
const PromotionController = require("../controllers/promotion");
const authMiddleware = require("../middlewares/authHandler");

const router = express.Router();

// Validation middleware
const promotionValidation = [
  body("promoCode").isString().withMessage("promoCode must be a string."),
  body("eligibleCategories")
    .isArray()
    .withMessage("Eligible categories must be an array"),
  body("discountType")
    .isIn(["percentage", "fixed"])
    .withMessage("Invalid discount type"),
  body("discountValue")
    .isFloat({ min: 0 })
    .withMessage("Discount value must be a non-negative number"),
  body("expirationDate").isDate().withMessage("Invalid expiration date"),
  body("usageLimit")
    .isInt({ min: 1 })
    .withMessage("Usage limit must be at least 1"),
];

router.post(
  "/",
  authMiddleware,
  promotionValidation,
  PromotionController.createPromotion
);

router.get("/", authMiddleware, PromotionController.getAllPromotions);

router.get(
  "/:id",
  [param("id").isInt().exists()],
  authMiddleware,
  PromotionController.getPromotionById
);
router.put(
  "/:id",
  authMiddleware,
  promotionValidation,
  PromotionController.updatePromotion
);

router.delete(
  "/:id",
  authMiddleware,
  param("id").isInt().exists(),
  PromotionController.deletePromotion
);

module.exports = router;
