import express from 'express';
import { UserController } from '../controllers/user.controller.js';
import { userValidation } from '../validations/userValidation.js';
import { objectIdValidation } from '../validations/objectIdValidation.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const userRouter = express.Router();

// get profle user
userRouter.get(
  '/profile',
  authMiddleware,
  UserController.getProfileUser
)

// only admin role can access
userRouter.patch(
  '/:id',
  objectIdValidation,
  userValidation.updateUserInfo,
  UserController.updateUser
);

// get one user
userRouter.get(
  '/:id',
  authMiddleware,
  objectIdValidation,
  UserController.getOneUser
);



export default userRouter;
