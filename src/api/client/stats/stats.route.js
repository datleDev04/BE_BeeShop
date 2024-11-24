import express from 'express';
import { statsController } from './stats.controller.js';
import { authMiddleware } from '../../../middleware/authMiddleware.js';
import { CheckPermission } from '../../../utils/CheckPermission.js';
const statsRouter = express.Router();

statsRouter.get(
  '/most-purchased-size',
  authMiddleware,
  CheckPermission(['Read_Stats']),
  statsController.getMostPurchasedSize
);
statsRouter.get(
  '/most-purchased-color',
  authMiddleware,
  CheckPermission(['Read_Stats']),
  statsController.getMostPurchasedColor
);
statsRouter.get(
  '/almost-out-of-stock',
  authMiddleware,
  CheckPermission(['Read_Stats']),
  statsController.getAlmostOutOfStock
);

statsRouter.get(
  '/most-orders',
  authMiddleware,
  CheckPermission(['Read_Stats']),
  statsController.getMostOrders
);

statsRouter.get(
  '/latest-reviews',
  authMiddleware,
  CheckPermission(['Read_Stats']),
  statsController.getLatestReviews
);

statsRouter.get(
  '/order-counts',
  authMiddleware,
  CheckPermission(['Read_Stats']),
  statsController.getOrderCountWithStatus
);

export { statsRouter };
