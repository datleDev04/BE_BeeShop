import express from 'express';
import { LabelController } from '../controllers/label.controller.js';
import { labelValidation } from '../validations/label.validation.js';
import { objectIdValidation } from '../validations/objectIdValidation.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { CheckPermission } from '../utils/CheckPermission.js';

const labelRouter = express.Router();

labelRouter.get('/', LabelController.getAllLabel);
labelRouter.get('/:id', objectIdValidation, LabelController.getOneLabel);

// create new label
labelRouter.post(
  '/',
  authMiddleware,
  CheckPermission("Create_Label"),
  labelValidation, 
  LabelController.createLabel
);

// update label
labelRouter.patch(
  '/:id', 
  authMiddleware,
  CheckPermission("Update_Label"),
  objectIdValidation, 
  labelValidation, 
  LabelController.updateLabelById
);

// delete label
labelRouter.delete(
  '/:id',  
  authMiddleware,
  CheckPermission("Delete_Label"),
  objectIdValidation,
  LabelController.deleteLabelById
);

export default labelRouter;
