import express from 'express';
import { statsController } from './stats.controller.js';
import { authMiddleware } from '../../../middleware/authMiddleware.js';
import { CheckPermission } from '../../../utils/CheckPermission.js'
const statsRouter = express.Router();

statsRouter.get('/most-purchased-size', authMiddleware, CheckPermission(['Read_Stats']), statsController.getMostPurchasedSize);
statsRouter.get('/most-purchased-color', authMiddleware, CheckPermission(['Read_Stats']), statsController.getMostPurchasedColor);

export { statsRouter };
