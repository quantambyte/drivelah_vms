"use strict";
const { Sequelize } = require("sequelize");
require("dotenv").config();

// Create a new instance of Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql", // Using MySQL dialect
  }
);

// Function to connect to the database
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("MySQL connected successfully");
    // Sync models with the database (without force to avoid data loss)
    await sequelize.sync(); // Use sync() for default behavior, no force
    console.log("Database synchronized successfully");
    return;
  } catch (error) {
    console.error("MySQL connection error:", error);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = { sequelize, connectDB };
