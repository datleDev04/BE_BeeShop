import express from "express";
import bannerClientRouter from "./banner.client.js";

const clientRouter = express.Router();

clientRouter.use('/banner', bannerClientRouter);

export default clientRouter