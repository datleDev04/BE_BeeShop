import express from "express";
import { productController } from "./product.controller.js"
const productRouter = express.Router()

productRouter.get('/', productController.getAllProducts)
productRouter.get('/:slug', productController.getProductBySlug)
productRouter.get('/:productId/reviews', productController.getProductReviews)

export default productRouter