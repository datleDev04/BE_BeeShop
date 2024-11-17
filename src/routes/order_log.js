import express from 'express';
import { objectIdValidation } from '../validations/objectId.validation.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { OrderLogController } from '../controllers/order_log.controller.js';

const orderLogRouter = express.Router();

// get logs by orderId
orderLogRouter.get('/:id', objectIdValidation, authMiddleware, OrderLogController.getLogsByOrderId);

export default orderLogRouter;
