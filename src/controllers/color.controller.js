import { StatusCodes } from 'http-status-codes';
import { Transformer } from '../utils/transformer.js';
import { SuccessResponse } from '../utils/response.js';
import ColorService from '../services/color.service.js';

export class ColorController {
  static createNewColor = async (req, res, next) => {
    try {
      const newColor = await ColorService.createNewColor(req);

      SuccessResponse(res, StatusCodes.CREATED, 'Create new color successfully', newColor);
    } catch (error) {
      next(error);
    }
  };
  static getColor = async (req, res, next) => {
    try {
      const color = await ColorService.getOneColor(req);

      SuccessResponse(res, StatusCodes.OK, 'Get color successfully', color);
    } catch (error) {
      next(error);
    }
  };
  static getAllColors = async (req, res, next) => {
    try {
      const { metaData, others } = await ColorService.getAllColor(req);

      SuccessResponse(res, StatusCodes.OK, 'Get All Color successfully', metaData, others);
    } catch (error) {
      next(error);
    }
  };

  static updateColor = async (req, res, next) => {
    try {
      const colors = await ColorService.updateColorById(req);

      SuccessResponse(res, StatusCodes.OK, 'Updated Color successfully', colors);
    } catch (error) {
      next(error);
    }
  };
  static deleteColor = async (req, res, next) => {
    try {
      await ColorService.deleteColorById(req);
      SuccessResponse(res, StatusCodes.OK, 'Delete Color successfully', {});
    } catch (error) {
      next(error);
    }
  };
}
