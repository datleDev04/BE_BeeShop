import express from 'express';
import { statsController } from './stats.controller.js';
import { authMiddleware } from '../../../middleware/authMiddleware.js';
const statsRouter = express.Router();

statsRouter.get('/most-purchased-size', authMiddleware, statsController.getMostPurchasedSize);
statsRouter.get('/most-purchased-color', authMiddleware, statsController.getMostPurchasedColor);

export { statsRouter };
