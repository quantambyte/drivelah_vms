"use strict";
const express = require("express");
const { body, param } = require("express-validator");
const ProductController = require("../controllers/product");
const authMiddleware = require("../middlewares/authHandler");

const router = express.Router();

// Validation middleware for creating/updating a product
const productValidation = [
  body("productName")
    .isString()
    .notEmpty()
    .withMessage("Product name is required"),
  body("productCategory")
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
    .withMessage("Invalid product category"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a non-negative number"),
  body("stock")
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
];

router.post(
  "/",
  authMiddleware,
  productValidation,
  ProductController.createProduct
);

router.get("/", authMiddleware, ProductController.getAllProducts);

router.get(
  "/:id",
  authMiddleware,
  param("id").isInt().exists(),
  ProductController.getProductById
);

router.put(
  "/:id",
  authMiddleware,
  [param("id").isInt(), ...productValidation],
  ProductController.updateProduct
);

router.delete(
  "/:id",
  authMiddleware,
  param("id").isInt(),
  ProductController.deleteProduct
);

module.exports = router;
