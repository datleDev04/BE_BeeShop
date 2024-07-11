import express from 'express';
import { GenderController } from '../controllers/gender.controller.js';
import { genderValidation } from '../validations/gender.validation.js';
import { objectIdValidation } from '../validations/objectId.validation.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { CheckPermission } from '../utils/CheckPermission.js';

const genderRouter = express.Router();

genderRouter.get(
  '/',
  authMiddleware,
  CheckPermission(['Read_Gender']),
  GenderController.getAllGenders
);
genderRouter.get(
  '/:id',
  authMiddleware,
  CheckPermission(['Read_Gender']),
  objectIdValidation,
  GenderController.getGender
);

// create new gender
genderRouter.post(
  '/',
  authMiddleware,
  CheckPermission(['Create_Gender']),
  genderValidation,
  GenderController.createNewGender
);

// update gender by id
genderRouter.patch(
  '/:id',
  authMiddleware,
  CheckPermission(['Update_Gender']),
  objectIdValidation,
  genderValidation,
  GenderController.updateGender
);

// delete gender by id
genderRouter.delete(
  '/:id',
  authMiddleware,
  CheckPermission(['Delete_Gender']),
  objectIdValidation,
  GenderController.deleteGender
);

export default genderRouter;
