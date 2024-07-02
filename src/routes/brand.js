import express from 'express';
import { BrandController } from '../controllers/brand.controller.js';
import { brandValidation } from '../validations/brandValidation.js';

const brandRouter = express.Router();

brandRouter.get('/', BrandController.getAllBrand);
brandRouter.get('/:id', BrandController.getOneBrand);
brandRouter.post('/', brandValidation, BrandController.createNewBrand);
brandRouter.put('/:id', brandValidation, BrandController.updateBrandById);
brandRouter.delete('/:id', BrandController.deleteBrandById);

export default brandRouter;
