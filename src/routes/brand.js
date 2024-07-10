import express from 'express';
import { BrandController } from '../controllers/brand.controller.js';
import { brandValidation } from '../validations/brand.validation.js';
import { objectIdValidation } from '../validations/objectId.validation.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { CheckPermission } from '../utils/CheckPermission.js';

const brandRouter = express.Router();

// get all brand
brandRouter.get(
  '/', 
  authMiddleware, 
  CheckPermission(['Read_Brand','All_Brand_Permission']), 
  BrandController.getAllBrand
);

// get one brand by id
brandRouter.get(
  '/:id',
  objectIdValidation,
  authMiddleware,
  CheckPermission(['Read_Brand','All_Brand_Permission']),
  BrandController.getOneBrand
);

// create a new brand
brandRouter.post(
  '/',
  authMiddleware,
  CheckPermission(['Create_Brand','All_Brand_Permission']),
  brandValidation,
  BrandController.createNewBrand
);

// update a brand by id
brandRouter.patch(
  '/:id',
  authMiddleware,
  CheckPermission(['Update_Brand','All_Brand_Permission']),
  objectIdValidation,
  brandValidation,
  BrandController.updateBrandById
);

// delete a brand by id
brandRouter.delete(
  '/:id',
  authMiddleware,
  CheckPermission(['Delete_Brand','All_Brand_Permission']),
  objectIdValidation,
  BrandController.deleteBrandById
);

export default brandRouter;
