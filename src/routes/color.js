import express from 'express';
import { ColorController } from '../controllers/color.controller.js';
import { createColorValidation, updateColorValidation } from '../validations/color.validation.js';
import { objectIdValidation } from '../validations/objectId.validation.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { CheckPermission } from '../utils/CheckPermission.js';

const colorRouter = express.Router();

colorRouter.get('/', authMiddleware, CheckPermission(['Read_Color']), ColorController.getAllColors);
colorRouter.get(
  '/:id',
  authMiddleware,
  CheckPermission(['Read_Color']),
  objectIdValidation,
  ColorController.getColor
);
colorRouter.post(
  '/',
  authMiddleware,
  CheckPermission(['Create_Color']),
  createColorValidation,
  ColorController.createNewColor
);
colorRouter.patch(
  '/:id',
  authMiddleware,
  CheckPermission(['Update_Color']),
  objectIdValidation,
  updateColorValidation,
  ColorController.updateColor
);
colorRouter.delete(
  '/:id',
  authMiddleware,
  CheckPermission(['Delete_Color']),
  objectIdValidation,
  ColorController.deleteColor
);

export default colorRouter;
