import express from "express";
import bannerClientRouter from "./banner.client.js";
import productClientRouter from "./product.client.js";
import colorClientRouter from "./color.client.js";

const clientRouter = express.Router();

clientRouter.use('/banner', bannerClientRouter);
clientRouter.use('/product', productClientRouter);
clientRouter.use('/color', colorClientRouter);

export default clientRouter