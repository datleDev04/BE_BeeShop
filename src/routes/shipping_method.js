import express from 'express';
import { objectIdValidation } from '../validations/objectId.validation.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { CheckPermission } from '../utils/CheckPermission.js';
import { ShippingMethodController } from '../controllers/shipping_method.controller.js';
import { shippingMethodValidation } from '../validations/shipping_method.validation.js';

const shippingMethodRouter = express.Router();

shippingMethodRouter.get(
  '/',
  authMiddleware,
  CheckPermission(['Read_ShippingMethod']),
  ShippingMethodController.getAllShippingMethods
);
shippingMethodRouter.get(
  '/:id',
  authMiddleware,
  CheckPermission(['Read_ShippingMethod']),
  objectIdValidation,
  ShippingMethodController.getShippingMethod
);
shippingMethodRouter.post(
  '/',
  authMiddleware,
  CheckPermission(['Create_ShippingMethod']),
  shippingMethodValidation,
  ShippingMethodController.createNewShippingMethod
);
shippingMethodRouter.patch(
  '/:id',
  authMiddleware,
  CheckPermission(['Update_ShippingMethod']),
  objectIdValidation,
  shippingMethodValidation,
  ShippingMethodController.updateShippingMethod
);
shippingMethodRouter.delete(
  '/:id',
  authMiddleware,
  CheckPermission(['Delete_ShippingMethod']),
  objectIdValidation,
  ShippingMethodController.deleteShippingMethod
);

export default shippingMethodRouter;
