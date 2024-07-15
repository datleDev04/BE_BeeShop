import express from 'express';
import { UserController } from '../controllers/user.controller.js';
import { userValidation } from '../validations/user.validation.js';
import { objectIdValidation } from '../validations/objectId.validation.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const userRouter = express.Router();

// only admin role can access
userRouter.patch(
  '/:id',
  authMiddleware,
  objectIdValidation,
  userValidation.updateUserInfo,
  UserController.updateUser
);

// get all users
userRouter.get('/', authMiddleware, UserController.getAllUsers);

// get profile of the authenticated user
userRouter.get('/profile', authMiddleware, UserController.getProfileUser);

// get one user by id (only for authenticated users)
userRouter.get('/:id', authMiddleware, objectIdValidation, UserController.getOneUser);

export default userRouter;
