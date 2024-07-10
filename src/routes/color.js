import express from 'express';
import { ColorController } from '../controllers/color.controller.js';
import { colorValidation } from '../validations/color.validation.js';
import { objectIdValidation } from '../validations/objectId.validation.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { CheckPermission } from '../utils/CheckPermission.js';

const colorRouter = express.Router();

colorRouter.get(
  '/',
  authMiddleware, 
  CheckPermission(['Read_Color','All_Color_Permission']),
  ColorController.getAllColors
);
colorRouter.get(
  '/:id',
  authMiddleware,
  CheckPermission(['Read_Color','All_Color_Permission']),
  objectIdValidation,
  ColorController.getColor
);
colorRouter.post(
  '/',
  authMiddleware,
  CheckPermission(['Create_Color','All_Color_Permission']),
  colorValidation,
  ColorController.createNewColor
);
colorRouter.patch(
  '/:id',
  authMiddleware,
  CheckPermission(['Update_Color','All_Color_Permission']),
  objectIdValidation,
  colorValidation,
  ColorController.updateColor
);
colorRouter.delete(
  '/:id',
  authMiddleware,
  CheckPermission(['Delete_Color','All_Color_Permission']),
  objectIdValidation,
  ColorController.deleteColor
);

export default colorRouter;
