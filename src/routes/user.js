import express from 'express';
import { UserController } from '../controllers/user.controller.js';
import { userValidation } from '../validations/user.validation.js';
import { objectIdValidation } from '../validations/objectId.validation.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { CheckPermission } from '../utils/CheckPermission.js';

const userRouter = express.Router();

userRouter.get('/', authMiddleware, CheckPermission(['Read_User']), UserController.getAllUsers);

userRouter.get(
  '/:id',
  authMiddleware,
  CheckPermission(['Read_User']),
  objectIdValidation,
  UserController.getOneUser
);

userRouter.post(
  '/',
  authMiddleware,
  CheckPermission(['Create_User']),
  userValidation.createUserInfo,
  UserController.createUser
);

userRouter.patch(
  '/:id',
  authMiddleware,
  objectIdValidation,
  // CheckPermission(['Update_User']),
  userValidation.updateUserInfo,
  UserController.updateUser
);

userRouter.delete(
  '/:id',
  authMiddleware,
  objectIdValidation,
  CheckPermission(['Delete_User']),
  UserController.deleteOneUser
);

export default userRouter;
