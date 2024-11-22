import express from 'express';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { OrderController } from '../../controllers/order.controller.js';
import { objectIdValidation } from '../../validations/objectId.validation.js';
import { orderValidation, updateOrderValidation } from '../../validations/order.validation.js';

const clientOrderRouter = express.Router();

// get all orders
clientOrderRouter.get('/', authMiddleware, OrderController.getAllOrders);

//get orders of user
clientOrderRouter.get('/user', authMiddleware, OrderController.getOrderByUser);

// get order by ID
clientOrderRouter.get('/:id', authMiddleware, objectIdValidation, OrderController.getOneOrder);

// create new order
clientOrderRouter.post('/', authMiddleware, orderValidation, OrderController.createOrder);

// re payment order
clientOrderRouter.post('/re-payment/:id', authMiddleware, OrderController.rePayment);

// re order
clientOrderRouter.post('/re-order/:id', authMiddleware, OrderController.reOrder);

// update order
clientOrderRouter.patch(
  '/:id',
  authMiddleware,
  updateOrderValidation,
  objectIdValidation,
  OrderController.updateOrderById
);

export default clientOrderRouter;
