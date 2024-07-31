import express from 'express';
import { objectIdValidation } from '../validations/objectId.validation.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { CheckPermission } from '../utils/CheckPermission.js';
import { UserGenderController } from '../controllers/user_gender.controller.js';
import {
  createUserGenderValidation,
  updateUserGenderValidation,
} from '../validations/user_gender.validation.js';

const userGenderRouter = express.Router();

userGenderRouter.get(
  '/',
  authMiddleware,
  CheckPermission(['Read_UserGender']),
  UserGenderController.getAllUserGenders
);

userGenderRouter.get(
  '/:id',
  authMiddleware,
  CheckPermission(['Read_UserGender']),
  objectIdValidation,
  UserGenderController.getOneUserGender
);

userGenderRouter.post(
  '/',
  authMiddleware,
  CheckPermission(['Create_UserGender']),
  createUserGenderValidation,
  UserGenderController.createUserGender
);

userGenderRouter.patch(
  '/:id',
  authMiddleware,
  CheckPermission(['Update_UserGender']),
  objectIdValidation,
  updateUserGenderValidation,
  UserGenderController.updateUserGenderById
);

userGenderRouter.delete(
  '/:id',
  authMiddleware,
  CheckPermission(['Delete_UserGender']),
  objectIdValidation,
  UserGenderController.deleteUserGenderById
);

export default userGenderRouter;
