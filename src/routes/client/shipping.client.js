import express from 'express';
import { ShippingClientController } from '../../controllers/client/shipping.controller.js';

const shippingClientRouter = express.Router();

shippingClientRouter.post('/shipping-fee', ShippingClientController.calculateShippingFee);

export default shippingClientRouter;
