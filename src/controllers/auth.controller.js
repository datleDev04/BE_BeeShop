import { StatusCodes } from 'http-status-codes';
import { AuthService } from '../services/auth.service.js';
import { Transformer } from '../utils/transformer.js';
import { SuccessResponse } from '../utils/response.js';
import { ServerResponse } from 'http';
import passport from 'passport';

export class AuthController {
  static register = async (req, res, next) => {
    try {
      const newUser = await AuthService.register(req);

      SuccessResponse(
        res,
        StatusCodes.OK,
        'Registration successfully',
        Transformer.transformObjectTypeSnakeToCamel(newUser.toObject())
      );
    } catch (error) {
      next(error);
    }
  };

  static login = async (req, res, next) => {
    try {
      const { user, accessToken, refreshToken } = await AuthService.login(req);

      const metaData = {
        userData: Transformer.transformObjectTypeSnakeToCamel(user.toObject()),
        accessToken: accessToken,
        refreshToken: refreshToken,
      };

      SuccessResponse(res, StatusCodes.OK, 'Login successfully', metaData);
    } catch (error) {
      next(error);
    }
  };

  static loginGoogle = async (req, res, next) => {
    try {
      const { accessToken, refreshToken } = await AuthService.loginGoogle(req);

      SuccessResponse(res, StatusCodes.OK, 'Logout successfully', { accessToken, refreshToken });
    } catch (error) {
      next(error);
    }
  };

  static getGoogleRedirectURL = (req, res, next) => {
    try {
      const emptyResponse = new ServerResponse(req);

      passport.authenticate('google', { scope: ['email', 'profile'], session: false })(
        req,
        emptyResponse
      );

      const url = emptyResponse.getHeader('location');

      return SuccessResponse(res, StatusCodes.OK, 'Success', url);
    } catch (error) {
      next(error);
    }
  };

  static logout = async (req, res, next) => {
    try {
      await AuthService.logout(req);

      SuccessResponse(res, StatusCodes.OK, 'Logout successfully', []);
    } catch (error) {
      next(error);
    }
  };

  static forgotPassword = async (req, res, next) => {
    try {
      await AuthService.forgotPassword(req.body);

      SuccessResponse(res, StatusCodes.OK, 'send mail forgot password successfully', []);
    } catch (error) {
      next(error);
    }
  };
  static resetPassword = async (req, res, next) => {
    try {
      await AuthService.resetPassword(req);

      SuccessResponse(res, StatusCodes.OK, 'reset password successfully', []);
    } catch (error) {
      next(error);
    }
  };

  static refreshToken = async (req, res, next) => {
    try {
      const { access_token, refresh_token } = await AuthService.refreshToken(req);

      const metaData = {
        accessToken: access_token,
        refreshToken: refresh_token,
      };

      SuccessResponse(
        res,
        StatusCodes.OK,
        'Refresh token successfully',
        Transformer.transformObjectTypeSnakeToCamel(metaData)
      );
    } catch (error) {
      next(error);
    }
  };

  static getProfileUser = async (req, res, next) => {
    try {
      const userProfile = await AuthService.getProfileUser(req);

      SuccessResponse(
        res,
        StatusCodes.OK,
        'Get Profile User successfully',
        Transformer.transformObjectTypeSnakeToCamel(userProfile)
      );
    } catch (error) {
      next(error);
    }
  };
}
