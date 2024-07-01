import { StatusCodes } from 'http-status-codes';
import { Transformer } from '../utils/transformer.js';
import { SuccessResponse } from '../utils/response.js';
import GenderService from '../services/gender.service.js';

export class GenderController {
  static createNewGender = async (req, res, next) => {
    try {
      const newGender = await GenderService.createNewGender(req);

      SuccessResponse(res, StatusCodes.CREATED, 'Create new gender successfully', Transformer.transformObjectTypeSnakeToCamel(newGender.toObject()));
    } catch (error) {
      next(error);
    }
  };
  static getGender = async (req, res, next) => {
    try {
      const gender = await GenderService.getOneGender(req);

      SuccessResponse(res, StatusCodes.OK, 'Get gender successfully', Transformer.transformObjectTypeSnakeToCamel(gender.toObject()));
    } catch (error) {
      next(error);
    }
  };
  static getAllGenders = async (req, res, next) => {
    try {
      const genders = await GenderService.getAllGender(req);

      const returnData = genders.map((gender) => {
        return Transformer.transformObjectTypeSnakeToCamel(gender.toObject());
      });

      SuccessResponse(res, StatusCodes.OK, 'Get All Gender successfully', returnData);
    } catch (error) {
      next(error);
    }
  };

  static updateGender = async (req, res, next) => {
    try {
      const genders = await GenderService.updateGenderById(req);

      SuccessResponse(res, StatusCodes.OK, 'Updated Gender successfully', Transformer.transformObjectTypeSnakeToCamel(genders.toObject()));
    } catch (error) {
      next(error);
    }
  };
  static deleteGender = async (req, res, next) => {
    try {
      await GenderService.deleteGenderById(req);

      SuccessResponse(res, StatusCodes.OK, 'Delete Gender successfully');
    } catch (error) {
      next(error);
    }
  };
}
