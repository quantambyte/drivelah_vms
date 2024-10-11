"use strict";

const swaggerJSDoc = require("swagger-jsdoc");
const PORT = process.env.PORT || 5000;

const options = {
  definition: {
    openapi: "3.0.0", // Version of OpenAPI
    info: {
      title: "Voucher and Promotion API", // Title of the API
      version: "1.0.0", // Version of the API
      description: "API documentation for managing vouchers and promotions", // Short description
    },
    servers: [
      {
        url: "http://localhost:3000/api", // URL of your local development server
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Voucher: {
          type: "object",
          properties: {
            id: { type: "integer" },
            voucherCode: { type: "string" },
            discountType: { type: "string", enum: ["percentage", "fixed"] },
            discountValue: { type: "number" },
            expirationDate: { type: "string", format: "date-time" },
            usageLimit: { type: "integer" },
            minimumOrderValue: { type: "number" },
          },
        },
        CreateVoucher: {
          type: "object",
          properties: {
            voucherCode: { type: "string" },
            discountType: { type: "string" },
            discountValue: { type: "number" },
            expirationDate: { type: "string", format: "date-time" },
            usageLimit: { type: "integer" },
            minimumOrderValue: { type: "number" },
          },
        },
        Order: {
          type: "object",
          properties: {
            id: { type: "integer" },
            userId: { type: "integer" },
            discountType: { type: "string" },
            discountId: { type: "integer" },
            totalPrice: { type: "number" },
            createdAt: { type: "string" },
            updatedAt: { type: "string" },
          },
        },
        CreateOrder: {
          type: "object",
          properties: {
            discountType: { type: "string" },
            discountCode: { type: "string" },
            totalPrice: { type: "number" },
          },
        },
        Promotion: {
          type: "object",
          properties: {
            id: { type: "integer" },
            promoCode: { type: "string" },
            discountType: { type: "string", enum: ["percentage", "fixed"] },
            discountValue: { type: "number" },
            eligibleCategories: {
              type: "array",
              items: { type: "string" },
            },
            expirationDate: { type: "string", format: "date-time" },
            usageLimit: { type: "integer" },
          },
        },
        CreatePromotion: {
          type: "object",
          properties: {
            promoCode: { type: "string" },
            discountType: { type: "string" },
            discountValue: { type: "number" },
            eligibleCategories: {
              type: "array",
              items: { type: "string" },
            },
            expirationDate: { type: "string", format: "date-time" },
            usageLimit: { type: "integer" },
          },
        },
        Product: {
          type: "object",
          properties: {
            id: { type: "integer" },
            productName: { type: "string" },
            productCategory: { type: "string" },
            price: { type: "number" },
            stock: { type: "integer" },
          },
        },
        CreateProduct: {
          type: "object",
          properties: {
            productName: { type: "string" },
            productCategory: { type: "string" },
            price: { type: "number" },
            stock: { type: "integer" },
          },
        },
      },
    },
    paths: {
      "/vouchers": {
        get: {
          security: [{ bearerAuth: [] }],
          summary: "Get all vouchers",
          tags: ["Vouchers"],
          responses: {
            200: {
              description: "List of vouchers",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Voucher" },
                  },
                },
              },
            },
            401: { description: "Unauthorized" },
          },
        },
        post: {
          security: [{ bearerAuth: [] }],
          summary: "Create a new voucher",
          tags: ["Vouchers"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateVoucher" },
              },
            },
          },
          responses: {
            200: { description: "Voucher created successfully" },
            400: { description: "Validation error" },
          },
        },
      },
      "/vouchers/{id}": {
        get: {
          security: [{ bearerAuth: [] }],
          summary: "Get a voucher by ID",
          tags: ["Vouchers"],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "integer" },
              description: "The voucher ID",
            },
          ],
          responses: {
            200: { description: "Voucher data" },
            404: { description: "Voucher not found" },
          },
        },
        put: {
          security: [{ bearerAuth: [] }],
          summary: "Update a voucher by ID",
          tags: ["Vouchers"],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "integer" },
              description: "The voucher ID",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    voucherCode: { type: "string", example: "SAVE65" },
                    discountType: { type: "string", example: "fixed" },
                    discountValue: { type: "number", example: 15 },
                    expirationDate: {
                      type: "string",
                      format: "date",
                      example: "2024-12-31",
                    },
                    usageLimit: { type: "integer", example: 200 },
                    minOrderValue: { type: "number", example: 100 },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Voucher updated successfully" },
            400: { description: "Validation error" },
            404: { description: "Voucher not found" },
          },
        },
        delete: {
          security: [{ bearerAuth: [] }],
          summary: "Delete a voucher by ID",
          tags: ["Vouchers"],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "integer" },
              description: "The voucher ID",
            },
          ],
          responses: {
            200: { description: "Voucher deleted successfully" },
            404: { description: "Voucher not found" },
          },
        },
      },
      "/orders": {
        post: {
          security: [{ bearerAuth: [] }],
          summary: "Create a new order",
          tags: ["Orders"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    products: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          productId: {
                            type: "integer",
                            example: 8,
                          },
                          productCategory: {
                            type: "string",
                            example: "food and beverage",
                          },
                          quantity: {
                            type: "integer",
                            example: 10,
                          },
                        },
                      },
                      example: [
                        {
                          productId: 8,
                          productCategory: "digital services",
                          quantity: 10,
                        },
                        {
                          productId: 10,
                          productCategory: "cosmetics and body care",
                          quantity: 5,
                        },
                      ],
                    },
                    discountType: { type: "string" },
                    discountCode: { type: "string" },
                    totalPrice: { type: "number" },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "Order created successfully" },
            400: { description: "Validation error" },
          },
        },
        get: {
          security: [{ bearerAuth: [] }],
          summary: "Get all orders",
          tags: ["Orders"],
          responses: {
            200: {
              description: "List of all orders",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Order" },
                  },
                },
              },
            },
            401: { description: "Unauthorized access" },
          },
        },
      },
      "/orders/{id}": {
        get: {
          security: [{ bearerAuth: [] }],
          summary: "Get order by ID",
          tags: ["Orders"],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "integer" },
              description: "The order ID",
            },
          ],
          responses: {
            200: { description: "Order details" },
            404: { description: "Order not found" },
          },
        },
        put: {
          security: [{ bearerAuth: [] }],
          summary: "Update an order by ID",
          tags: ["Orders"],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "integer" },
              description: "The order ID",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    products: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          productId: {
                            type: "integer",
                            example: 8,
                          },
                          productCategory: {
                            type: "string",
                            example: "food and beverage",
                          },
                          quantity: {
                            type: "integer",
                            example: 10,
                          },
                        },
                      },
                      example: [
                        {
                          productId: 8,
                          productCategory: "digital services",
                          quantity: 10,
                        },
                        {
                          productId: 10,
                          productCategory: "cosmetics and body care",
                          quantity: 5,
                        },
                      ],
                    },
                    discountType: { type: "string" },
                    discountCode: { type: "string" },
                    totalPrice: { type: "number" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Order updated successfully" },
            404: { description: "Order not found" },
          },
        },
        delete: {
          security: [{ bearerAuth: [] }],
          summary: "Delete an order by ID",
          tags: ["Orders"],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "integer" },
              description: "The order ID",
            },
          ],
          responses: {
            200: { description: "Order deleted successfully" },
            404: { description: "Order not found" },
          },
        },
      },
      "/orders/{id}/apply-discount": {
        post: {
          security: [{ bearerAuth: [] }],
          summary: "Apply a discount (voucher or promotion) to an order",
          tags: ["Orders"],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "integer" },
              description: "The order ID",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    discountType: {
                      type: "string",
                      enum: ["voucher", "promotion"],
                      example: "voucher",
                    },
                    discountCode: {
                      type: "string",
                      example: "SAVE40",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Discount applied successfully",
            },
            404: {
              description: "Order or discount not found",
            },
          },
        },
      },
      "/promotions": {
        get: {
          security: [{ bearerAuth: [] }],
          summary: "Get all promotions",
          tags: ["Promotions"],
          responses: {
            200: {
              description: "List of promotions",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Promotion" },
                  },
                },
              },
            },
            401: { description: "Unauthorized" },
          },
        },
        post: {
          security: [{ bearerAuth: [] }],
          summary: "Create a new promotion",
          tags: ["Promotions"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreatePromotion" },
              },
            },
          },
          responses: {
            200: { description: "Promotion created successfully" },
            400: { description: "Validation error" },
          },
        },
      },
      "/promotions/{id}": {
        get: {
          security: [{ bearerAuth: [] }],
          summary: "Get a promotion by ID",
          tags: ["Promotions"],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "integer" },
              description: "The promotion ID",
            },
          ],
          responses: {
            200: { description: "Promotion data" },
            404: { description: "Promotion not found" },
          },
        },
        put: {
          security: [{ bearerAuth: [] }],
          summary: "Update a promotion by ID",
          tags: ["Promotions"],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "integer" },
              description: "The promotion ID",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    promoCode: { type: "string", example: "NewYearSale" },
                    discountType: { type: "string", example: "percentage" },
                    discountValue: { type: "number", example: 20 },
                    eligibleCategories: {
                      type: "array",
                      items: { type: "string" },
                      example: ["Electronics", "Books"],
                    },
                    expirationDate: {
                      type: "string",
                      format: "date-time",
                      example: "2024-12-31T23:59:59Z",
                    },
                    usageLimit: { type: "integer", example: 100 },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Promotion updated successfully" },
            404: { description: "Promotion not found" },
          },
        },
        delete: {
          security: [{ bearerAuth: [] }],
          summary: "Delete a promotion by ID",
          tags: ["Promotions"],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "integer" },
              description: "The promotion ID",
            },
          ],
          responses: {
            200: { description: "Promotion deleted successfully" },
            404: { description: "Promotion not found" },
          },
        },
      },
      "/products": {
        post: {
          security: [{ bearerAuth: [] }],
          summary: "Create a new product",
          tags: ["Products"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateProduct" },
              },
            },
          },
          responses: {
            201: { description: "Product created successfully" },
            400: { description: "Validation error" },
          },
        },
        get: {
          security: [{ bearerAuth: [] }],
          summary: "Get all products",
          tags: ["Products"],
          responses: {
            200: {
              description: "List of all products",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Product" },
                  },
                },
              },
            },
          },
        },
      },
      "/products/{id}": {
        get: {
          security: [{ bearerAuth: [] }],
          summary: "Fetch a product by ID",
          tags: ["Products"],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "integer" },
              description: "The product ID",
            },
          ],
          responses: {
            200: { description: "Product found" },
            404: { description: "Product not found" },
          },
        },
        put: {
          security: [{ bearerAuth: [] }],
          summary: "Update a product by ID",
          tags: ["Products"],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "integer" },
              description: "The product ID",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    productName: { type: "string" },
                    productCategory: { type: "string" },
                    price: { type: "number" },
                    stock: { type: "integer" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Product updated successfully" },
            404: { description: "Product not found" },
          },
        },
        delete: {
          security: [{ bearerAuth: [] }],
          summary: "Delete a product by ID",
          tags: ["Products"],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "integer" },
              description: "The product ID",
            },
          ],
          responses: {
            200: { description: "Product deleted successfully" },
            404: { description: "Product not found" },
          },
        },
      },
      "/users/register": {
        post: {
          summary: "Register a new user",
          tags: ["Users"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    userName: {
                      type: "string",
                      example: "John Doe",
                    },
                    userEmail: {
                      type: "string",
                      format: "email",
                      example: "john.doe@example.com",
                    },
                    userPassword: {
                      type: "string",
                      format: "password",
                      example: "password123",
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "User registered successfully",
            },
            400: {
              description: "Validation error",
            },
          },
        },
      },
      "/users/login": {
        post: {
          summary: "Login a user",
          tags: ["Users"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    userEmail: {
                      type: "string",
                      format: "email",
                      example: "john@example.com",
                    },
                    userPassword: {
                      type: "string",
                      format: "password",
                      example: "password1",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "User logged in successfully",
            },
            401: {
              description: "Invalid credentials",
            },
            400: {
              description: "Validation error",
            },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js"], // Path to your API routes
};

module.exports = options;

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
