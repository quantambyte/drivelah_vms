"use strict";

const AppError = require("../utils/AppError");
const errorHandler = (err, req, res, next) => {
  console.error(err); // Log the error for debugging

  // Set default values for status code and message
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // If it's an instance of AppError, we will send the custom error message and status
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Send response
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }), // Include stack trace in development
  });
};

module.exports = errorHandler;
