import { StatusCodes } from 'http-status-codes';
import { Transformer } from '../utils/transformer.js';
import { SuccessResponse } from '../utils/response.js';
import SizeService from '../services/size.service.js';

export class SizeController {
  static createNewSize = async (req, res, next) => {
    try {
      const newSize = await SizeService.createNewSize(req);

      SuccessResponse(res, StatusCodes.CREATED, 'Create new size successfully', newSize);
    } catch (error) {
      next(error);
    }
  };
  static getSize = async (req, res, next) => {
    try {
      const size = await SizeService.getOneSize(req);

      SuccessResponse(res, StatusCodes.OK, 'Get size successfully', size);
    } catch (error) {
      next(error);
    }
  };
  static getAllSizes = async (req, res, next) => {
    try {
      const { metaData, others } = await SizeService.getAllSize(req);

      SuccessResponse(res, StatusCodes.OK, 'Get All Size successfully', metaData, others);
    } catch (error) {
      next(error);
    }
  };

  static updateSize = async (req, res, next) => {
    try {
      const size = await SizeService.updateSizeById(req);

      SuccessResponse(res, StatusCodes.OK, 'Updated Size successfully', size);
    } catch (error) {
      next(error);
    }
  };
  static deleteSize = async (req, res, next) => {
    try {
      await SizeService.deleteSizeById(req);

      SuccessResponse(res, StatusCodes.OK, 'Delete Size successfully', {});
    } catch (error) {
      next(error);
    }
  };
}
