import express from "express";
import bannerClientRouter from "./banner.client.js";
import productClientRouter from "./product.client.js";
import colorClientRouter from "./color.client.js";
import sizeClientRouter from "./size.client.js";
import productTypeClientRouter from "./product_type.client.js";
import wishListClientRouter from "./wishlist.client.js";
import tagClientRouter from "./tag.client.js";

const clientRouter = express.Router();

clientRouter.use('/banner', bannerClientRouter);
clientRouter.use('/product', productClientRouter);
clientRouter.use('/color', colorClientRouter);
clientRouter.use('/size', sizeClientRouter);
clientRouter.use('/product-type', productTypeClientRouter);
clientRouter.use('/wishlist', wishListClientRouter);
clientRouter.use('/tag', tagClientRouter);

export default clientRouter