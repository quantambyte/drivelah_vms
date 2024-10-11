"use strict";
const { User } = require("../models");
const AppError = require("../utils/AppError");

class UserService {
  static async createUser(userData) {
    try {
      const user = await User.create(userData);
      return user;
    } catch (error) {
      throw new AppError(`Error creating user. error: ${error}`, 500);
    }
  }

  static async getUserByEmail(userEmail) {
    try {
      const user = await User.findOne({ where: { userEmail } });
      return user;
    } catch (error) {
      throw new AppError(
        `Error fetching user with email ${userEmail}. error: ${error}`,
        500
      );
    }
  }
}

module.exports = UserService;
