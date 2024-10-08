import express from "express";
import bannerClientRouter from "./banner.client.js";
import productClientRouter from "./product.client.js";

const clientRouter = express.Router();

clientRouter.use('/banner', bannerClientRouter);
clientRouter.use('/product', productClientRouter);

export default clientRouter