"use strict";
const express = require("express");
const { body, param } = require("express-validator");
const VoucherController = require("../controllers/voucher");
const authMiddleware = require("../middlewares/authHandler");

const router = express.Router();

// Validation middleware
const voucherValidation = [
  body("voucherCode").isString().withMessage("Voucher Code must be a string"),
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
  body("minimumOrderValue")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum order value must be a non-negative number"),
];

router.post(
  "/",
  authMiddleware,
  voucherValidation,
  VoucherController.createVoucher
);
router.get("/", authMiddleware, VoucherController.getAllVouchers);
router.get("/:id", authMiddleware, VoucherController.getVoucherById);
router.put(
  "/:id",
  authMiddleware,
  voucherValidation,
  VoucherController.updateVoucher
);
router.delete(
  "/:id",
  authMiddleware,
  param("id").isInt(),
  VoucherController.deleteVoucher
);

module.exports = router;
