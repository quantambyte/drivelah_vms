"use strict";
const express = require("express");
const { body } = require("express-validator");
const UserController = require("../controllers/user");

const router = express.Router();

// Validation middleware for user registration
const registerValidation = [
  body("userName").isString().notEmpty().withMessage("User name is required"),
  body("userEmail").isEmail().withMessage("Invalid email format"),
  body("userPassword")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

const loginValidation = [
  body("userEmail").isEmail().withMessage("Invalid email format"),
  body("userPassword")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

// Routes
router.post("/register", registerValidation, UserController.registerUser);
router.post("/login", loginValidation, UserController.loginUser);

module.exports = router;
