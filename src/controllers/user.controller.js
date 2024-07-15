import { StatusCodes } from 'http-status-codes';
import UserService from '../services/user.service.js';
import { Transformer } from '../utils/transformer.js';
import { SuccessResponse } from '../utils/response.js';

export class UserController {
  static updateUser = async (req, res, next) => {
    try {
      const updatedUser = await UserService.updateUser(req);
      SuccessResponse(
        res,
        StatusCodes.OK,
        'Updated User successfully',
        Transformer.transformObjectTypeSnakeToCamel(updatedUser.toObject())
      );
    } catch (error) {
      next(error);
    }
  };

  static getOneUser = async (req, res, next) => {
    try {
      const user = await UserService.getOneUser(req);
      SuccessResponse(
        res,
        StatusCodes.OK,
        'Get One User successfully',
        Transformer.transformObjectTypeSnakeToCamel(user.toObject())
      );
    } catch (error) {
      next(error);
    }
  };

  static getProfileUser = async (req, res, next) => {
    try {
      const user = await UserService.getOneUser({ params: { id: req.user._id } });
      const userProfile = {
        ...user.toObject(),
        list_name_permission: req.user.list_name_permission,
        list_name_role: req.user.list_name_role,
      };
      SuccessResponse(
        res,
        StatusCodes.OK,
        'Get Profile successfully',
        Transformer.transformObjectTypeSnakeToCamel(userProfile)
      );
    } catch (error) {
      next(error);
    }
  };

  static getAllUsers = async (req, res, next) => {
    try {
      const users = await UserService.getAllUsers(req);
      SuccessResponse(
        res,
        StatusCodes.OK,
        'Get All Users successfully',
        Transformer.transformObjectTypeSnakeToCamel(users)
      );
    } catch (error) {
      next(error);
    }
  };
}
