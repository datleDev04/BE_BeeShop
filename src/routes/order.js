import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { OrderController } from '../controllers/order.controller.js';
import { objectIdValidation } from '../validations/objectId.validation.js';
import { updateOrderValidation } from '../validations/order.validation.js';

const orderRouter = express.Router();

// get all orders
orderRouter.get('/', authMiddleware, OrderController.getAllOrders);

//get orders of user
orderRouter.get('/user', authMiddleware, OrderController.getOrderByUser);

// get order by ID
orderRouter.get('/:id', authMiddleware, objectIdValidation, OrderController.getOneOrder);

// update order
orderRouter.patch(
  '/:id',
  authMiddleware,
  updateOrderValidation,
  objectIdValidation,
  OrderController.updateOrderById
);

export default orderRouter;
