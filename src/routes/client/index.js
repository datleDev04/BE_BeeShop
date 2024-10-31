import express from 'express';
import bannerClientRouter from './banner.client.js';
import productClientRouter from './product.client.js';
import colorClientRouter from './color.client.js';
import sizeClientRouter from './size.client.js';
import productTypeClientRouter from './product_type.client.js';
import wishListClientRouter from './wishlist.client.js';
import tagClientRouter from './tag.client.js';
import cartRouter from './cart.js';
import orderRouter from './order.js';
import shippingClientRouter from './shipping.client.js';
import productRouter from '../../api/client/product/product.route.js'

const clientRouter = express.Router();

clientRouter.use('/banner', bannerClientRouter);
// clientRouter.use('/product', productClientRouter);
clientRouter.use('/color', colorClientRouter);
clientRouter.use('/size', sizeClientRouter);
clientRouter.use('/product-type', productTypeClientRouter);
clientRouter.use('/wishlist', wishListClientRouter);
clientRouter.use('/tag', tagClientRouter);
clientRouter.use('/cart', cartRouter);
clientRouter.use('/order', orderRouter);
clientRouter.use('/shipping', shippingClientRouter);


clientRouter.use('/products', productRouter)

export default clientRouter;
