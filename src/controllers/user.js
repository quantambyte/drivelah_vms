"use strict";
const UserService = require("../services/user");
const { validationResult } = require("express-validator");
const AppError = require("../utils/AppError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class UserController {
  static async registerUser(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new AppError(
          `User Register Validation failed. error: ${JSON.stringify(errors)}`,
          400
        )
      );
    }

    try {
      const { userName, userEmail, userPassword } = req.body;
      const newUser = await UserService.createUser({
        userName,
        userEmail,
        userPassword: userPassword,
      });

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: newUser,
      });
    } catch (error) {
      return next(
        new AppError(`Failed to register the user. error:${error}`, 500)
      );
    }
  }

  static async loginUser(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new AppError(
          `User Login Validation failed. error:${JSON.stringify(errors)}`,
          400
        )
      );
    }

    try {
      const { userEmail, userPassword } = req.body;
      const user = await UserService.getUserByEmail(userEmail);
      if (!user) {
        return next(new AppError(`Invalid email`, 401));
      }

      const isMatch = await bcrypt.compare(userPassword, user.userPassword);
      if (!isMatch) {
        return next(new AppError(`Invalid password`, 401));
      }

      const token = jwt.sign(
        { id: user.id, userEmail: user.userEmail },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.status(200).json({ success: true, token });
    } catch (error) {
      return next(
        new AppError(
          `Failed to Login user with email ${userEmail}. error:${error}`,
          500
        )
      );
    }
  }
}

module.exports = UserController;
