import { StatusCodes } from 'http-status-codes';
import { Transformer } from '../utils/transformer.js';
import { SuccessResponse } from '../utils/response.js';
import ColorService from '../services/color.service.js';

export class ColorController {
  static createNewColor = async (req, res, next) => {
    try {
      const newColor = await ColorService.createNewColor(req);

      SuccessResponse(
        res,
        StatusCodes.CREATED,
        'Create new color successfully',
        Transformer.transformObjectTypeSnakeToCamel(newColor.toObject())
      );
    } catch (error) {
      next(error);
    }
  };
  static getColor = async (req, res, next) => {
    try {
      const color = await ColorService.getOneColor(req);

      SuccessResponse(
        res,
        StatusCodes.OK,
        'Get color successfully',
        Transformer.transformObjectTypeSnakeToCamel(color.toObject())
      );
    } catch (error) {
      next(error);
    }
  };
  static getAllColors = async (req, res, next) => {
    try {
      const colors = await ColorService.getAllColor(req);

      const returnData = colors.map((color) => {
        return Transformer.transformObjectTypeSnakeToCamel(color.toObject());
      });

      SuccessResponse(res, StatusCodes.OK, 'Get All Color successfully', returnData);
    } catch (error) {
      next(error);
    }
  };

  static updateColor = async (req, res, next) => {
    try {
      const colors = await ColorService.updateColorById(req);

      SuccessResponse(
        res,
        StatusCodes.OK,
        'Updated Color successfully',
        Transformer.transformObjectTypeSnakeToCamel(colors.toObject())
      );
    } catch (error) {
      next(error);
    }
  };
  static deleteColor = async (req, res, next) => {
    try {
      const deletedColor = await ColorService.deleteColorById(req);

      SuccessResponse(
        res,
        StatusCodes.OK,
        'Delete Color successfully',
        Transformer.transformObjectTypeSnakeToCamel(deletedColor.toObject())
      );
    } catch (error) {
      next(error);
    }
  };
}
