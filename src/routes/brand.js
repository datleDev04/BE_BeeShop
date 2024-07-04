import express from 'express';
import { BrandController } from '../controllers/brand.controller.js';
import { brandValidation } from '../validations/brandValidation.js';
import { objectIdValidation } from '../validations/objectIdValidation.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { CheckPermission } from '../utils/CheckPermission.js';

const brandRouter = express.Router();

// get all brand
brandRouter.get(
  '/',
  BrandController.getAllBrand
);

// get one brand by id
brandRouter.get(
  '/:id',
  objectIdValidation,
  BrandController.getOneBrand
);

// create a new brand
brandRouter.post(
  '/',
  authMiddleware,
  CheckPermission('Create_Brand'),
  brandValidation,
  BrandController.createNewBrand
);

// update a brand by id
brandRouter.patch(
  '/:id',
  authMiddleware,
  CheckPermission("Update_Brand"),
  objectIdValidation, 
  brandValidation, 
  BrandController.updateBrandById
);

// delete a brand by id
brandRouter.delete(
  '/:id',
  authMiddleware,
  CheckPermission("Delete_Brand"),
  objectIdValidation,
  BrandController.deleteBrandById
);

export default brandRouter;
