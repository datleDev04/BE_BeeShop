import express from "express";
import { ProductController } from "../../controllers/product.controller.js";
import { objectIdValidation } from "../../validations/objectId.validation.js";

const productClientRouter = express.Router();


productClientRouter.get(
  '/',
  ProductController.getAllProduct
);

productClientRouter.get(
  '/:id',
  objectIdValidation,
  ProductController.getOneProduct
);

export default productClientRouter