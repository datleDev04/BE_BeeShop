import { StatusCodes } from 'http-status-codes';
import { SuccessResponse } from '../utils/response.js';
import GenderService from '../services/gender.service.js';

export class GenderController {
  static createNewGender = async (req, res, next) => {
    try {
      const newGender = await GenderService.createNewGender(req);

      SuccessResponse(res, StatusCodes.CREATED, 'Create new gender successfully', newGender);
    } catch (error) {
      next(error);
    }
  };
  static getGender = async (req, res, next) => {
    try {
      const gender = await GenderService.getOneGender(req);

      SuccessResponse(res, StatusCodes.OK, 'Get gender successfully', gender);
    } catch (error) {
      next(error);
    }
  };
  static getAllGenders = async (req, res, next) => {
    try {
      const { metaData, others } = await GenderService.getAllGender(req);

      SuccessResponse(res, StatusCodes.OK, 'Get All Gender successfully', metaData, others);
    } catch (error) {
      next(error);
    }
  };

  static clientGetAllGenders = async (req, res, next) => {
    try {
      const { metaData, others } = await GenderService.getAllGender(req);
      SuccessResponse(res, StatusCodes.OK, 'Get All Gender successfully', metaData, others);
    } catch (error) {
      next(error);
    }
  };

  static updateGender = async (req, res, next) => {
    try {
      const gender = await GenderService.updateGenderById(req);

      SuccessResponse(res, StatusCodes.OK, 'Updated Gender successfully', gender);
    } catch (error) {
      next(error);
    }
  };
  static deleteGender = async (req, res, next) => {
    try {
      await GenderService.deleteGenderById(req);

      SuccessResponse(res, StatusCodes.OK, 'Delete Gender successfully', {});
    } catch (error) {
      next(error);
    }
  };
}
