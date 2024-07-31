import { StatusCodes } from 'http-status-codes';
import { SuccessResponse } from '../utils/response.js';
import { UserGenderService } from '../services/user_gender.service.js';

export class UserGenderController {
  static getAllUserGenders = async (req, res, next) => {
    try {
      const { metaData, others } = await UserGenderService.getAllUserGenders(req);

      SuccessResponse(res, StatusCodes.OK, 'Get all user gender successfully', metaData, others);
    } catch (error) {
      next(error);
    }
  };

  static getOneUserGender = async (req, res, next) => {
    try {
      const userGender = await UserGenderService.getOneUserGender(req);

      SuccessResponse(res, StatusCodes.OK, 'Get one user gender successfully', userGender);
    } catch (error) {
      next(error);
    }
  };

  static createUserGender = async (req, res, next) => {
    try {
      const newUserGender = await UserGenderService.createUserGender(req);
      SuccessResponse(
        res,
        StatusCodes.CREATED,
        'Create new user gender successfully',
        newUserGender
      );
    } catch (error) {
      next(error);
    }
  };

  static updateUserGenderById = async (req, res, next) => {
    try {
      const updatedUserGender = await UserGenderService.updateUserGenderById(req);

      SuccessResponse(res, StatusCodes.OK, 'Updated user gender successfully', updatedUserGender);
    } catch (error) {
      next(error);
    }
  };

  static deleteUserGenderById = async (req, res, next) => {
    try {
      await UserGenderService.deleteUserGenderBydId(req);

      SuccessResponse(res, StatusCodes.OK, 'deleted user gender successfully', {});
    } catch (error) {
      next(error);
    }
  };
}
