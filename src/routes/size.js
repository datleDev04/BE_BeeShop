import express from 'express';
import { SizeController } from '../controllers/size.controller.js';
import { sizeValidation } from '../validations/sizeValidation.js';
import { objectIdValidation } from '../validations/objectIdValidation.js';
import { CheckPermission } from '../utils/CheckPermission.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const sizeRouter = express.Router();

sizeRouter.get('/', SizeController.getAllSizes);
sizeRouter.get('/:id', objectIdValidation, SizeController.getSize);
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
  sizeValidation,
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
