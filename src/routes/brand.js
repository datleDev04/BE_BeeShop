import express from 'express';
import { BrandController } from '../controllers/brand.controller.js';
import { brandValidation } from '../validations/brandValidation.js';
import { objectIdValidation } from '../validations/objectIdValidation.js';

const brandRouter = express.Router();

brandRouter.get('/', BrandController.getAllBrand);
brandRouter.get('/:id', objectIdValidation, BrandController.getOneBrand);
brandRouter.post('/', brandValidation, BrandController.createNewBrand);
brandRouter.put('/:id', objectIdValidation, brandValidation, BrandController.updateBrandById);
brandRouter.delete('/:id', objectIdValidation, BrandController.deleteBrandById);

export default brandRouter;
