import express from 'express';
import { SizeController } from '../controllers/size.controller.js';
import { sizeValidation, updateSizeValidation } from '../validations/size.validation.js';
import { objectIdValidation } from '../validations/objectId.validation.js';
import { CheckPermission } from '../utils/CheckPermission.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const sizeRouter = express.Router();

sizeRouter.get('/', authMiddleware, CheckPermission('Read_Size'), SizeController.getAllSizes);
sizeRouter.get(
  '/:id',
  authMiddleware,
  CheckPermission('Read_Size'),
  objectIdValidation,
  SizeController.getSize
);
sizeRouter.post(
  '/',
  authMiddleware,
  CheckPermission('Create_Size'),
  sizeValidation,
  SizeController.createNewSize
);
sizeRouter.patch(
  '/:id',
  authMiddleware,
  CheckPermission('Update_Size'),
  objectIdValidation,
  updateSizeValidation,
  SizeController.updateSize
);
sizeRouter.delete(
  '/:id',
  authMiddleware,
  CheckPermission('Delete_Size'),
  objectIdValidation,
  SizeController.deleteSize
);

export default sizeRouter;
