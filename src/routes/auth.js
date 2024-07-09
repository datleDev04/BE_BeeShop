import express from 'express';
import authValidation from '../validations/authValidation.js';
import { AuthController } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const authRouter = express.Router();



authRouter.post('/register', authValidation.registerValidation, AuthController.register);
authRouter.post('/login', authValidation.loginValidation, AuthController.login);
authRouter.post('/logout', authMiddleware, AuthController.logout);

authRouter.post('/forgot-password', AuthController.forgotPassword);
authRouter.post('/reset-password/:token', AuthController.resetPassword);

authRouter.post('/refresh-token', AuthController.refreshToken);

// get profle user
authRouter.get(
  '/profile',
  authMiddleware,
  AuthController.getProfileUser
)


export default authRouter;
