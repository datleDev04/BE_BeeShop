import express from 'express';
import { objectIdValidation } from '../../validations/objectId.validation.js';
import { ProductTypeController } from '../../controllers/product_type.controller.js';

const productTypeClientRouter = express.Router();

productTypeClientRouter.get(
  '/',
  ProductTypeController.getAllProductTypes
);
productTypeClientRouter.get(
  '/:id',
  objectIdValidation,
  ProductTypeController.getProductType
);

export default productTypeClientRouter;
