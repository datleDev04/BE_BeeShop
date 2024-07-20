import express from 'express';
import { LabelController } from '../controllers/label.controller.js';
import { createLabelValidation, updateLabelValidation } from '../validations/label.validation.js';
import { objectIdValidation } from '../validations/objectId.validation.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { CheckPermission } from '../utils/CheckPermission.js';

const labelRouter = express.Router();

labelRouter.get(
  '/',
  authMiddleware,
  CheckPermission(['Read_Label']),

  LabelController.getAllLabel
);

labelRouter.get(
  '/:id',
  authMiddleware,
  CheckPermission(['Read_Label']),
  objectIdValidation,
  LabelController.getOneLabel
);

// create new label
labelRouter.post(
  '/',
  authMiddleware,
  CheckPermission(['Create_Label']),
  createLabelValidation,
  LabelController.createLabel
);

// update label
labelRouter.patch(
  '/:id',
  authMiddleware,
  CheckPermission(['Update_Label']),
  objectIdValidation,
  updateLabelValidation,
  LabelController.updateLabelById
);

// delete label
labelRouter.delete(
  '/:id',
  authMiddleware,
  CheckPermission(['Delete_Label']),
  objectIdValidation,
  LabelController.deleteLabelById
);

export default labelRouter;
