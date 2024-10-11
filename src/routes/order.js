"use strict";

const express = require("express");
const { body, param } = require("express-validator");
const OrderController = require("../controllers/order");
const authMiddleware = require("../middlewares/authHandler");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  body("totalPrice")
    .isFloat({ min: 0 })
    .withMessage("Total Price must be a non-negative number"),
  body("discountType")
    .isIn(["voucher", "promotion"])
    .withMessage("Discount type must be either 'voucher' or 'promotion'"),
  body("discountCode")
    .isString()
    .withMessage("Discount Code must be a string."),
  body("products.*.productId")
    .isInt({ min: 1 })
    .withMessage("Each product must have a valid productId."),
  body("products.*.productCategory")
    .isIn([
      "digital services",
      "cosmetics and body care",
      "food and beverage",
      "furniture and decor",
      "health and wellness",
      "household items",
      "media",
      "pet care",
      "office equipment",
    ])
    .withMessage("Each product must have a valid category."),
  body("products.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Each product must have a valid quantity greater than 0."),
  OrderController.createOrder
);

router.get("/", authMiddleware, OrderController.getAllOrders);

router.get(
  "/:id",
  authMiddleware,
  param("id").isInt().withMessage("Order ID must be an integer"),
  OrderController.getOrderById
);

router.post(
  "/:id/apply-discount",
  authMiddleware,
  body("discountType")
    .isIn(["voucher", "promotion"])
    .withMessage("Discount type must be either 'voucher' or 'promotion'"),
  body("discountCode")
    .isString()
    .withMessage("Discount Code must be a string."),
  OrderController.applyDiscount
);

router.put(
  "/:id",
  authMiddleware,
  [
    param("id").isInt().withMessage("Order ID must be an integer"),
    body("totalPrice")
      .isFloat({ min: 0 })
      .withMessage("Total Price must be a non-negative number"),
    body("discountType")
      .isIn(["voucher", "promotion"])
      .withMessage("Discount type must be either 'voucher' or 'promotion'"),
    body("discountCode")
      .isString()
      .withMessage("Discount Code must be a string."),
    body("products.*.productId")
      .isInt({ min: 1 })
      .withMessage("Each product must have a valid productId."),
    body("products.*.productCategory")
      .isIn([
        "digital services",
        "cosmetics and body care",
        "food and beverage",
        "furniture and decor",
        "health and wellness",
        "household items",
        "media",
        "pet care",
        "office equipment",
      ])
      .withMessage("Each product must have a valid category."),
    body("products.*.quantity")
      .isInt({ min: 1 })
      .withMessage("Each product must have a valid quantity greater than 0."),
  ],
  OrderController.updateOrder
);

router.delete(
  "/:id",
  authMiddleware,
  param("id").isInt().withMessage("Order ID must be an integer"),
  OrderController.deleteOrder
);

module.exports = router;
