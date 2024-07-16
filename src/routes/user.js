import express from 'express';
import { UserController } from '../controllers/user.controller.js';
import { userValidation } from '../validations/user.validation.js';
import { objectIdValidation } from '../validations/objectId.validation.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { CheckPermission } from '../utils/CheckPermission.js';

const userRouter = express.Router();
// get all users
userRouter.get('/', authMiddleware, CheckPermission(['Read_User']), UserController.getAllUsers);

// get one user by id (only for authenticated users)
userRouter.get(
  '/:id',
  authMiddleware,
  CheckPermission(['Read_User']),
  objectIdValidation,
  UserController.getOneUser
);

// only admin role can access
userRouter.patch(
  '/:id',
  authMiddleware,
  objectIdValidation,
  CheckPermission(['Update_User']),
  userValidation.updateUserInfo,
  UserController.updateUser
);

export default userRouter;
