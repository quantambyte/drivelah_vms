"use strict";
const { validationResult } = require("express-validator");
const ProductService = require("../services/product");
const AppError = require("../utils/AppError");

class ProductController {
  static async createProduct(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          new AppError(
            `Product Creation Validation failed. errors:${JSON.stringify(
              errors
            )}`,
            400
          )
        );
      }

      const newProduct = await ProductService.createProduct(req.body);

      return res.status(201).json(newProduct);
    } catch (error) {
      return next(
        new AppError(`Failed to create product. error:${error}`, 500)
      );
    }
  }

  static async getAllProducts(req, res, next) {
    try {
      const products = await ProductService.getAllProducts();
      return res.status(200).json(products);
    } catch (error) {
      return next(
        new AppError(`Failed to retrieve products. error: ${error}`, 500)
      );
    }
  }

  static async getProductById(req, res, next) {
    const { id } = req.params;
    try {
      const product = await ProductService.getProductById(id);
      if (!product) {
        return next(new AppError(`Product with id ${id} not found`, 404));
      }

      return res.status(200).json(product);
    } catch (error) {
      return next(
        new AppError(
          `Failed to retrieve product with id ${id}. error:${error}`,
          500
        )
      );
    }
  }

  static async updateProduct(req, res, next) {
    const { id } = req.params;
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          new AppError(
            `Product with id ${id} failed validation. errors:${JSON.stringify(
              errors
            )}`,
            400
          )
        );
      }

      const updatedProduct = await ProductService.updateProduct(id, req.body);
      if (!updatedProduct) {
        return next(new AppError(`Product with id ${id} not found`, 404));
      }

      return res.status(200).json(updatedProduct);
    } catch (error) {
      return next(
        new AppError(
          `Failed to update product with id ${id}. error:${error}`,
          500
        )
      );
    }
  }

  static async deleteProduct(req, res, next) {
    const { id } = req.params;
    try {
      const deletedProduct = await ProductService.deleteProduct(id);
      if (!deletedProduct) {
        return next(new AppError(`Product with id ${id} not found`, 404));
      }

      return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      return next(
        new AppError(
          `Failed to delete product with id ${id}. error:${error}`,
          500
        )
      );
    }
  }
}

module.exports = ProductController;
