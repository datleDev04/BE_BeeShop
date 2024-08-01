import express from 'express';
import authValidation from '../validations/auth.validation.js';
import { AuthController } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import passport from 'passport';
const authRouter = express.Router();

authRouter.post('/register', authValidation.registerValidation, AuthController.register);
authRouter.post('/login', authValidation.loginValidation, AuthController.login);
authRouter.post('/logout', authMiddleware, AuthController.logout);

authRouter.post('/forgot-password', AuthController.forgotPassword);
authRouter.post('/reset-password/:token', AuthController.resetPassword);

authRouter.post('/refresh-token', AuthController.refreshToken);

authRouter.get('/google/redirect', AuthController.getGoogleRedirectURL);

authRouter.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  AuthController.loginGoogle
);

authRouter.get;

// get profle user
authRouter.get('/profile', authMiddleware, AuthController.getProfileUser);

export default authRouter;
