import express from 'express';
import bannerClientRouter from './banner.client.js';
import productClientRouter from './product.client.js';
import colorClientRouter from './color.client.js';
import sizeClientRouter from './size.client.js';
import productTypeClientRouter from './product_type.client.js';
import wishListClientRouter from './wishlist.client.js';
import tagClientRouter from './tag.client.js';
import cartRouter from './cart.js';
import clientOrderRouter from './order.js';
import genderRouter from './genders.client.js';
import shippingClientRouter from './shipping.client.js';
import vnpayRouter from './vnpay.js';
import payosRouter from './payos.js';
import productRouter from '../../api/client/product/product.route.js';
import clientVoucherRouter from './voucher.js';
import { reviewRouter } from '../../api/client/review/review.route.js'

const clientRouter = express.Router();

clientRouter.use('/banner', bannerClientRouter);
// clientRouter.use('/product', productClientRouter);
clientRouter.use('/color', colorClientRouter);
clientRouter.use('/size', sizeClientRouter);
clientRouter.use('/product-type', productTypeClientRouter);
clientRouter.use('/wishlist', wishListClientRouter);
clientRouter.use('/tag', tagClientRouter);
clientRouter.use('/cart', cartRouter);
clientRouter.use('/order', clientOrderRouter);
clientRouter.use('/genders', genderRouter);
clientRouter.use('/shipping', shippingClientRouter);
clientRouter.use('/vnpay', vnpayRouter);
clientRouter.use('/payos', payosRouter);
clientRouter.use('/voucher', clientVoucherRouter);

clientRouter.use('/products', productRouter);
clientRouter.use('/reviews', reviewRouter);

export default clientRouter;
