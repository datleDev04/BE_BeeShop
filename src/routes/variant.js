import express from 'express';

import { objectIdValidation } from '../validations/objectId.validation.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { CheckPermission } from '../utils/CheckPermission.js';
import {
  createVariantValidation,
  updateVariantValidation,
} from '../validations/variant.validation.js';
import { VariantController } from '../controllers/variant.controller.js';

const variantRouter = express.Router();

variantRouter.get(
  '/',
  authMiddleware,
  CheckPermission(['Read_Variant']),
  VariantController.getAllVariant
);
variantRouter.get(
  '/:id',
  authMiddleware,
  CheckPermission(['Read_Variant']),
  objectIdValidation,
  VariantController.getOneVariant
);

variantRouter.post(
  '/',
  authMiddleware,
  CheckPermission(['Create_Variant']),
  createVariantValidation,
  VariantController.createVariant
);

variantRouter.patch(
  '/:id',
  objectIdValidation,
  authMiddleware,
  CheckPermission(['Update_Variant']),
  updateVariantValidation,
  VariantController.updateVariantById
);

variantRouter.delete(
  '/:id',
  objectIdValidation,
  authMiddleware,
  CheckPermission(['Delete_Variant']),
  VariantController.deleteVariantById
);

export default variantRouter;
