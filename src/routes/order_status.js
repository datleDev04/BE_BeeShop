import express from 'express';
import { objectIdValidation } from '../validations/objectId.validation.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { CheckPermission } from '../utils/CheckPermission.js';
import { orderStatusValidation } from '../validations/order_status.validation.js';
import { OrderStatusController } from '../controllers/order_status.js';

const orderStatusRouter = express.Router();

orderStatusRouter.get(
  '/',
  authMiddleware,
  CheckPermission(['Read_OrderStatus']),
  OrderStatusController.getAllOrderStatus
);
orderStatusRouter.get(
  '/:id',
  authMiddleware,
  CheckPermission(['Read_OrderStatus']),
  objectIdValidation,
  OrderStatusController.getOneOrderStatus
);

// create new Order Status
orderStatusRouter.post(
  '/',
  authMiddleware,
  CheckPermission(['Create_OrderStatus']),
  orderStatusValidation,
  OrderStatusController.createOrderStatus
);

// update Order Status
orderStatusRouter.patch(
  '/:id',
  authMiddleware,
  CheckPermission(['Update_OrderStatus']),
  objectIdValidation,
  orderStatusValidation,
  OrderStatusController.updateOrderStatusById
);

// delete Order Status
orderStatusRouter.delete(
  '/:id',
  authMiddleware,
  CheckPermission(['Delete_OrderStatus']),
  objectIdValidation,
  OrderStatusController.deleteOrderStatusById
);

export default orderStatusRouter;
