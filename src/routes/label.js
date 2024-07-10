import express from 'express';
import { LabelController } from '../controllers/label.controller.js';
import { labelValidation } from '../validations/label.validation.js';
import { objectIdValidation } from '../validations/objectId.validation.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { CheckPermission } from '../utils/CheckPermission.js';

const labelRouter = express.Router();

labelRouter.get(
  '/',
  authMiddleware,
  CheckPermission(['Read_Label', 'All_Label_Permission']),
  LabelController.getAllLabel
);
labelRouter.get(
  '/:id', 
  authMiddleware,
  CheckPermission(['Read_Label', 'All_Label_Permission']),
  objectIdValidation, 
  LabelController.getOneLabel
);

// create new label
labelRouter.post(
  '/',
  authMiddleware,
  CheckPermission(['Create_Label', 'All_Label_Permission']),
  labelValidation,
  LabelController.createLabel
);

// update label
labelRouter.patch(
  '/:id',
  authMiddleware,
  CheckPermission(['Update_Label', 'All_Label_Permission']),
  objectIdValidation,
  labelValidation,
  LabelController.updateLabelById
);

// delete label
labelRouter.delete(
  '/:id',
  authMiddleware,
  CheckPermission(['Delete_Label', 'All_Label_Permission']),
  objectIdValidation,
  LabelController.deleteLabelById
);

export default labelRouter;
