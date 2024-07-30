import express from 'express';
import { objectIdValidation } from '../validations/objectId.validation.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { CheckPermission } from '../utils/CheckPermission.js';
import { ProductTypeController } from '../controllers/product_type.controller.js';
import {
  createProductTypeValidation,
  updateProductTypeValidation,
} from '../validations/product_type.validation.js';

const productTypeRouter = express.Router();

productTypeRouter.get(
  '/',
  authMiddleware,
  CheckPermission(['Read_ProductType']),
  ProductTypeController.getAllProductTypes
);
productTypeRouter.get(
  '/:id',
  authMiddleware,
  CheckPermission(['Read_ProductType']),
  objectIdValidation,
  ProductTypeController.getProductType
);
productTypeRouter.post(
  '/',
  authMiddleware,
  CheckPermission(['Create_ProductType']),
  createProductTypeValidation,
  ProductTypeController.createNewProductType
);
productTypeRouter.patch(
  '/:id',
  authMiddleware,
  CheckPermission(['Update_ProductType']),
  objectIdValidation,
  updateProductTypeValidation,
  ProductTypeController.updateProductType
);
productTypeRouter.delete(
  '/:id',
  authMiddleware,
  CheckPermission(['Delete_ProductType']),
  objectIdValidation,
  ProductTypeController.deleteProductType
);

export default productTypeRouter;
