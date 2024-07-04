import express from 'express';
import { LabelController } from '../controllers/label.controller.js';
import { labelValidation } from '../validations/label.validation.js';
import { objectIdValidation } from '../validations/objectIdValidation.js';

const labelRouter = express.Router();

labelRouter.get('/', LabelController.getAllLabel);
labelRouter.get('/:id', objectIdValidation, LabelController.getOneLabel);
labelRouter.post('/', labelValidation, LabelController.createLabel);
labelRouter.patch('/:id', objectIdValidation, labelValidation, LabelController.updateLabelById);
labelRouter.delete('/:id', objectIdValidation, LabelController.deleteLabelById);

export default labelRouter;
