import express from 'express';
import { objectIdValidation } from '../../validations/objectId.validation.js';
import { ColorController } from '../../controllers/color.controller.js';

const colorClientRouter = express.Router();

colorClientRouter.get('/', ColorController.getAllColors);

colorClientRouter.get(
  '/:id',
  objectIdValidation,
  ColorController.getColor
);
export default colorClientRouter;
