"use strict";
const express = require("express");
const rateLimit = require("express-rate-limit");
const { connectDB, sequelize } = require("./database/db.config");
const cors = require("cors");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger/swagger");
const voucherRoutes = require("./routes/voucher");
const promotionRoutes = require("./routes/promotion");
const productRoutes = require("./routes/product");
const userRoutes = require("./routes/user");
const orderRoutes = require("./routes/order");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.set("trust proxy", true);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

// Apply the rate limiter to all requests
app.use(limiter);

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Serve the Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//Routes
app.use("/api/users", userRoutes);
app.use("/api/vouchers", voucherRoutes);
app.use("/api/promotions", promotionRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Test endpoint to verify the server is working
app.get("/test", async (req, res) => {
  try {
    // Execute a simple query to check the connection
    console.log("test");
    await sequelize.query("SELECT 1 + 1 AS solution");
    res.status(200).json({ message: "Database connection is working!" });
  } catch (error) {
    res.status(500).json({ message: "Database connection failed", error });
  }
});

app.all("*", (req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Swagger is running on http://localhost:${PORT}/api-docs`);
  console.log("Database Host:", process.env.DB_HOST);
  console.log("Running in:", process.env.NODE_ENV);
});
