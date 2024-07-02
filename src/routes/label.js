import express from 'express';
import { LabelController } from '../controllers/label.controller.js';
import { labelValidation } from '../validations/label.validation.js';

const labelRouter = express.Router();

labelRouter.get('/', LabelController.getAllLabel);
labelRouter.get('/:id', LabelController.getOneLabel);
labelRouter.post('/', labelValidation, LabelController.createLabel);
labelRouter.patch('/:id', labelValidation, LabelController.updateLabelById);
labelRouter.delete('/:id', LabelController.deleteLabelById);

export default labelRouter;
