import express from 'express';
import { OrderController } from '../../controllers/order.controller.js';

const vnpayRouter = express.Router();

// vnpay return
vnpayRouter.get('/vnpay_return', OrderController.vnpayReturn);

export default vnpayRouter;
