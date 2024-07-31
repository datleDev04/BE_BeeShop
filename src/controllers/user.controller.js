import { StatusCodes } from 'http-status-codes';
import UserService from '../services/user.service.js';
import { SuccessResponse } from '../utils/response.js';

export class UserController {
  static updateUser = async (req, res, next) => {
    try {
      const updatedUser = await UserService.updateUser(req);

      SuccessResponse(res, StatusCodes.OK, 'Updated User successfully', updatedUser);
    } catch (error) {
      next(error);
    }
  };

  static createUser = async (req, res, next) => {
    try {
      const createdUser = await UserService.createUser(req);

      SuccessResponse(res, StatusCodes.OK, 'Created User successfully', createdUser);
    } catch (error) {
      next(error);
    }
  };

  static getOneUser = async (req, res, next) => {
    try {
      const user = await UserService.getOneUser(req);
      SuccessResponse(res, StatusCodes.OK, 'Get One User successfully', user);
    } catch (error) {
      next(error);
    }
  };

  static getAllUsers = async (req, res, next) => {
    try {
      const { metaData, ...otherFields } = await UserService.getAllUsers(req);

      SuccessResponse(res, StatusCodes.OK, 'Get All Users successfully', metaData, otherFields);
    } catch (error) {
      next(error);
    }
  };
  static deleteOneUser = async (req, res, next) => {
    try {
      const user_deleting = await UserService.deleteUser(req);

      SuccessResponse(res, StatusCodes.OK, 'Delete One User successfully', user_deleting);
    } catch (error) {
      next(error);
    }
  };
}
