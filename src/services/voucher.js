"use strict";
const { Voucher } = require("../models");
const { Op } = require("sequelize");

class VoucherService {
  static async createVoucher(data) {
    return await Voucher.create(data);
  }

  static async getAllVouchers() {
    return await Voucher.findAll();
  }

  static async getVoucherById(voucherId) {
    return await Voucher.findByPk(voucherId);
  }

  static async getVoucherByCode(voucherCode, totalPrice) {
    return await Voucher.findOne({
      where: {
        voucherCode,
        expirationDate: {
          [Op.gt]: new Date(),
        },
        minimumOrderValue: {
          [Op.lte]: totalPrice,
        },
        usageLimit: {
          [Op.gt]: 0,
        },
      },
    });
  }

  static async updateVoucher(voucherId, updatedData) {
    const voucher = await Voucher.findByPk(voucherId);
    if (voucher) {
      await voucher.update(updatedData);
      return voucher;
    }
    return null;
  }

  static async deleteVoucher(voucherId) {
    const voucher = await Voucher.findByPk(voucherId);
    if (voucher) {
      await voucher.destroy();
      return voucher;
    }
    return null;
  }
}

module.exports = VoucherService;
