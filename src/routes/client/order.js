import express from 'express';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { OrderController } from '../../controllers/order.controller.js';
import { objectIdValidation } from '../../validations/objectId.validation.js';

const orderRouter = express.Router();

// get all orders
orderRouter.get('/', authMiddleware, OrderController.getAllOrders);

// get order by ID
orderRouter.get('/:id', authMiddleware, objectIdValidation, OrderController.getOneOrder);

//get orders of user
orderRouter.get('/user', authMiddleware, objectIdValidation, OrderController.getOrderByUser);

// create new order
orderRouter.post('/', authMiddleware, OrderController.createOrder);

// re payment order
orderRouter.post('/re-payment/:id', authMiddleware, OrderController.rePayment);

// re order
orderRouter.post('/re-order/:id', authMiddleware, OrderController.reOrder);

// update order
orderRouter.patch('/:id', authMiddleware, objectIdValidation, OrderController.updateOrderById);

export default orderRouter;
