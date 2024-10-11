"use strict";
const VoucherService = require("../services/voucher");
const { validationResult } = require("express-validator");
const AppError = require("../utils/AppError");

class VoucherController {
  static async createVoucher(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new AppError(
          `Voucher Creation Validation failed. errors:${JSON.stringify(
            errors
          )}`,
          400
        )
      );
    }
    try {
      const voucherData = req.body;
      const newVoucher = await VoucherService.createVoucher(voucherData);
      return res.status(201).json({ success: true, data: newVoucher });
    } catch (error) {
      return next(
        new AppError(`Failed to create voucher. error:${error}`, 500)
      );
    }
  }

  static async getAllVouchers(req, res, next) {
    try {
      const vouchers = await VoucherService.getAllVouchers();
      return res.status(200).json({ success: true, data: vouchers });
    } catch (error) {
      return next(
        new AppError(`Failed to retrieve vouchers. error:${error}`, 500)
      );
    }
  }

  static async getVoucherById(req, res, next) {
    const voucherId = req.params.id;
    try {
      const voucher = await VoucherService.getVoucherById(voucherId);
      if (!voucher) {
        return next(
          new AppError(`Voucher with id ${voucherId} not found`, 404)
        );
      }
      return res.status(200).json({ success: true, data: voucher });
    } catch (error) {
      return next(
        new AppError(
          `Failed to retrieve voucher with id ${voucherId}. error: ${error}`,
          500
        )
      );
    }
  }

  static async updateVoucher(req, res) {
    const voucherId = req.params.id;
    try {
      const updatedData = req.body;
      const updatedVoucher = await VoucherService.updateVoucher(
        voucherId,
        updatedData
      );
      if (!updatedVoucher) {
        return next(
          new AppError(`Voucher with id ${voucherId} not found.`, 404)
        );
      }
      return res.status(200).json({ success: true, data: updatedVoucher });
    } catch (error) {
      return next(
        new AppError(
          `Failed to update voucher with id ${voucherId}. error: ${error}`,
          500
        )
      );
    }
  }

  static async deleteVoucher(req, res) {
    const voucherId = req.params.id;
    try {
      const deletedVoucher = await VoucherService.deleteVoucher(voucherId);
      if (!deletedVoucher) {
        return next(new AppError(`Voucher with ${voucherId} not found`, 404));
      }
      return res
        .status(200)
        .json({ success: true, message: "Voucher deleted successfully" });
    } catch (error) {
      return next(
        new AppError(
          `Failed to delete voucher with id ${voucherId}. error: ${error}`,
          500
        )
      );
    }
  }
}

module.exports = VoucherController;
