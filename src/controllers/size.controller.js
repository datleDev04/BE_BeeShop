import { StatusCodes } from 'http-status-codes';
import { Transformer } from '../utils/transformer.js';
import { SuccessResponse } from '../utils/response.js';
import SizeService from '../services/size.service.js';

export class SizeController {
  static createNewSize = async (req, res, next) => {
    try {
      const newSize = await SizeService.createNewSize(req);

      SuccessResponse(
        res,
        StatusCodes.CREATED,
        'Create new size successfully',
        Transformer.transformObjectTypeSnakeToCamel(newSize.toObject())
      );
    } catch (error) {
      next(error);
    }
  };
  static getSize = async (req, res, next) => {
    try {
      const size = await SizeService.getOneSize(req);

      SuccessResponse(
        res,
        StatusCodes.OK,
        'Get size successfully',
        Transformer.transformObjectTypeSnakeToCamel(size.toObject())
      );
    } catch (error) {
      next(error);
    }
  };
  static getAllSizes = async (req, res, next) => {
    try {
      const sizes = await SizeService.getAllSize(req);

      const returnData = sizes.map((size) => {
        return Transformer.transformObjectTypeSnakeToCamel(size.toObject());
      });

      SuccessResponse(res, StatusCodes.OK, 'Get All Size successfully', returnData);
    } catch (error) {
      next(error);
    }
  };

  static updateSize = async (req, res, next) => {
    try {
      const sizes = await SizeService.updateSizeById(req);

      SuccessResponse(
        res,
        StatusCodes.OK,
        'Updated Size successfully',
        Transformer.transformObjectTypeSnakeToCamel(sizes.toObject())
      );
    } catch (error) {
      next(error);
    }
  };
  static deleteSize = async (req, res, next) => {
    try {
      const deletedSize = await SizeService.deleteSizeById(req);

      SuccessResponse(
        res,
        StatusCodes.OK,
        'Delete Size successfully',
        Transformer.transformObjectTypeSnakeToCamel(deletedSize.toObject())
      );
    } catch (error) {
      next(error);
    }
  };
}
