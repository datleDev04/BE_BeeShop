import express from 'express';
import { SizeController } from '../controllers/size.controller.js';
import { sizeValidation, updateSizeValidation } from '../validations/size.validation.js';
import { objectIdValidation } from '../validations/objectId.validation.js';
import { CheckPermission } from '../utils/CheckPermission.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const sizeRouter = express.Router();

sizeRouter.get(
  '/', 
  authMiddleware, 
  CheckPermission(['Read_Size', 'All_Size_Permission']), 
  SizeController.getAllSizes
);
sizeRouter.get(
  '/:id',
  authMiddleware,
  CheckPermission(['Read_Size', 'All_Size_Permission']), 
  objectIdValidation,
  SizeController.getSize
);
sizeRouter.post(
  '/',
  authMiddleware,
  CheckPermission(['Create_Size', 'All_Size_Permission']),
  sizeValidation,
  SizeController.createNewSize
);
sizeRouter.patch(
  '/:id',
  authMiddleware,
  CheckPermission(['Update_Size', 'All_Size_Permission']),
  objectIdValidation,
  updateSizeValidation,
  SizeController.updateSize
);
sizeRouter.delete(
  '/:id',
  authMiddleware,
  CheckPermission(['Delete_Size', 'All_Size_Permission']),
  objectIdValidation,
  SizeController.deleteSize
);

export default sizeRouter;
