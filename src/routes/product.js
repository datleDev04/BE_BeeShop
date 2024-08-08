import express from 'express';
import {
  createProductValidation,
  updateProductValidation,
} from '../validations/product.validation.js';
import { objectIdValidation } from '../validations/objectId.validation.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { CheckPermission } from '../utils/CheckPermission.js';
import { ProductController } from '../controllers/product.controller.js';

const productRouter = express.Router();

productRouter.get(
  '/',
  authMiddleware,
  CheckPermission(['Read_Product']),
  ProductController.getAllProduct
);

productRouter.get(
  '/:id',
  objectIdValidation,
  authMiddleware,
  CheckPermission(['Read_Product']),
  ProductController.getOneProduct
);

productRouter.post(
  '/',
  authMiddleware,
  CheckPermission(['Create_Product']),
  createProductValidation,
  ProductController.createNewProduct
);

productRouter.patch(
  '/:id',
  objectIdValidation,
  authMiddleware,
  CheckPermission(['Update_Product']),
  updateProductValidation,
  ProductController.updateProduct
);

productRouter.delete(
  '/:id',
  objectIdValidation,
  authMiddleware,
  CheckPermission(['Delete_Product']),
  ProductController.deleteProduct
);

export default productRouter;
