import express from 'express';
import { OrderController } from '../../controllers/order.controller.js';

const payosRouter = express.Router();

// vnpay return
payosRouter.get('/', OrderController.payosReturn);

export default payosRouter;
