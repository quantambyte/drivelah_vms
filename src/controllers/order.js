"use strict";
const OrderService = require("../services/order");
const OrderProductService = require("../services/orderProduct");
const ProductService = require("../services/product");
const AppError = require("../utils/AppError");
const { sequelize } = require("../models");

const createOrder = async (req, res, next) => {
  const { totalPrice, discountType, discountCode, products } = req.body;
  const { user } = req;
  let orderProductsData = [];

  const transaction = await sequelize.transaction();
  try {
    const discount = await OrderService.calculateDiscount(
      totalPrice,
      discountType,
      discountCode,
      products
    );

    // Check if result is an instance of AppError
    if (discount instanceof AppError) {
      return next(
        new AppError(
          `Failed to apply discount to order with id ${id}. error: ${discount.message}`,
          500
        )
      );
    }
    const order = await OrderService.createOrder(
      {
        userId: user.id,
        discountType,
        discountId: discountObj?.id || null,
        totalPrice: totalPriceAfterDiscount,
      },
      transaction
    );

    if (!order) {
      return next(new AppError(`Failed to create order`, 500));
    }

    products.forEach((product) => {
      orderProductsData.push({
        orderId: order.id,
        productId: product.productId,
        quantity: product.quantity,
      });
    });

    const orderProducts = await OrderProductService.createOrderProducts(
      orderProductsData,
      transaction
    );

    for (const product of orderProducts) {
      await ProductService.reduceProductStock(
        product.productId,
        product.quantity,
        transaction
      );
    }

    await discountObj?.save({ transaction });

    await transaction.commit();

    return res.status(201).json({ order, orderProducts });
  } catch (error) {
    await transaction.rollback();
    return next(new AppError(`Failed to create order. error:${error}`, 500));
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await OrderService.getAllOrders();
    return res.status(200).json(orders);
  } catch (error) {
    return next(
      new AppError(`Failed to retrieve orders. error: ${error}`, 500)
    );
  }
};

const getOrderById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const order = await OrderService.getOrderById(id);
    if (!order) {
      return next(new AppError(`Order with id ${id} not found`, 404));
    }
    return res.status(200).json(order);
  } catch (error) {
    return next(
      new AppError(
        `Failed to retrieve order with id ${id}. error:${error}`,
        500
      )
    );
  }
};

const applyDiscount = async (req, res, next) => {
  const { id } = req.params;
  const { discountType, discountCode } = req.body;
  const { user } = req;
  let orderProductsData = [];

  const transaction = await sequelize.transaction();

  try {
    const order = await OrderService.getOrderById(id);
    if (!order) {
      return next(new AppError(`Order with id ${id} not found`, 404));
    }

    const { discountType: orderDiscountType, discountId: orderDiscountId } =
      order;

    if (orderDiscountType && orderDiscountId) {
      return next(
        new AppError(`Order with id ${id} already has a discount applied`, 400)
      );
    }

    const orderProducts = await OrderProductService.getOrderProductsByOrderId(
      id
    );

    const productIds = orderProducts.map((product) => product.productId);

    const products = await ProductService.getProductsByIds(productIds);

    const discount = await OrderService.calculateDiscount(
      order.totalPrice,
      discountType,
      discountCode,
      products
    );

    // Check if result is an instance of AppError
    if (discount instanceof AppError) {
      return next(
        new AppError(
          `Failed to apply discount to order with id ${id}. error: ${discount.message}`,
          500
        )
      );
    }

    const { totalPriceAfterDiscount, discountObj } = discount;

    const updatedOrder = await OrderService.updateOrder(
      id,
      {
        userId: user.id,
        discountType,
        discountId: discountObj?.id || null,
        totalPrice: totalPriceAfterDiscount,
      },
      transaction
    );

    if (!updatedOrder) {
      return next(new AppError(`Failed to update order with id ${id}`, 500));
    }

    orderProducts.forEach((product) => {
      orderProductsData.push({
        orderId: id,
        productId: product.productId,
        quantity: product.quantity,
      });
    });

    const updatedOrderProducts =
      await OrderProductService.updateOrderProductsByOrderId(
        id,
        orderProductsData,
        transaction
      );

    for (const product of updatedOrderProducts) {
      await ProductService.reduceProductStock(
        product.productId,
        product.quantity,
        transaction
      );
    }

    await discountObj?.save({ transaction });

    await transaction.commit();

    return res.status(201).json({ updatedOrder, updatedOrderProducts });
  } catch (error) {
    await transaction.rollback();
    throw new AppError(
      `Failed to apply discount to order with id ${id}. error: ${error}`,
      500
    );
  }
};

const updateOrder = async (req, res, next) => {
  const { id } = req.params;
  const { totalPrice, discountType, discountCode, products } = req.body;
  const { user } = req;
  let orderProductsData = [];

  const transaction = await sequelize.transaction();

  try {
    const discount = await OrderService.calculateDiscount(
      totalPrice,
      discountType,
      discountCode,
      products
    );

    // Check if result is an instance of AppError
    if (discount instanceof AppError) {
      return next(
        new AppError(
          `Failed to apply discount to order with id ${id}. error: ${discount.message}`,
          500
        )
      );
    }

    const { totalPriceAfterDiscount, discountObj } = discount;

    const updatedOrder = await OrderService.updateOrder(
      id,
      {
        userId: user.id,
        discountType,
        discountId: discountObj?.id || null,
        totalPrice: totalPriceAfterDiscount,
      },
      transaction
    );

    if (!updatedOrder) {
      return next(new AppError(`Failed to update order with id ${id}`, 500));
    }

    products.forEach((product) => {
      orderProductsData.push({
        orderId: order.id,
        productId: product.productId,
        quantity: product.quantity,
      });
    });

    const updatedOrderProducts =
      await OrderProductService.updateOrderProductsByOrderId(
        id,
        orderProductsData,
        transaction
      );

    for (const product of updatedOrderProducts) {
      await ProductService.reduceProductStock(
        product.productId,
        product.quantity,
        transaction
      );
    }

    await discountObj?.save({ transaction });

    await transaction.commit();

    return res.status(201).json({ updatedOrder });
  } catch (error) {
    await transaction.rollback();
    throw new AppError(
      `Failed to update order with id ${id}. error: ${error}`,
      500
    );
  }
};

const deleteOrder = async (req, res, next) => {
  const { id } = req.params;

  try {
    const result = await OrderService.deleteOrder(id);
    if (!result) {
      return next(new AppError(`Order with id ${id} not found`, 404));
    }
    return res.status(204).send();
  } catch (error) {
    return next(
      new AppError(`Failed to delete order with id ${id}. error:${error}`, 500)
    );
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  applyDiscount,
  updateOrder,
  deleteOrder,
};
