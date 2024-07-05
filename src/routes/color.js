import express from 'express';
import { ColorController } from '../controllers/color.controller.js';
import { colorValidation } from '../validations/colorValidation.js';
import { objectIdValidation } from '../validations/objectIdValidation.js';

const colorRouter = express.Router();

colorRouter.get('/', ColorController.getAllColors);
colorRouter.get('/:id', objectIdValidation, ColorController.getColor);
colorRouter.post('/', colorValidation, ColorController.createNewColor);
colorRouter.patch('/:id', objectIdValidation, colorValidation, ColorController.updateColor);
colorRouter.delete('/:id', objectIdValidation, ColorController.deleteColor);

export default colorRouter;
