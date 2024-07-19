import { StatusCodes } from 'http-status-codes';
import { SuccessResponse } from '../utils/response.js';
import { VariantService } from '../services/variant.service.js';

export class VariantController {
  static getAllVariant = async (req, res, next) => {
    try {
      const { metaData, others } = await VariantService.getAllVariants(req);

      SuccessResponse(res, StatusCodes.OK, 'Get all variant successfully', metaData, others);
    } catch (error) {
      next(error);
    }
  };

  static getOneVariant = async (req, res, next) => {
    try {
      const tag = await VariantService.getOneVariant(req);

      SuccessResponse(res, StatusCodes.OK, 'Get one variant successfully', tag);
    } catch (error) {
      next(error);
    }
  };
  static createVariant = async (req, res, next) => {
    try {
      const newVariant = await VariantService.createVariant(req);
      SuccessResponse(res, StatusCodes.CREATED, 'Create new variant successfully', newVariant);
    } catch (error) {
      next(error);
    }
  };

  static updateVariantById = async (req, res, next) => {
    try {
      const updatedVariant = await VariantService.updateVariantById(req);

      SuccessResponse(res, StatusCodes.OK, 'Updated variant successfully', updatedVariant);
    } catch (error) {
      next(error);
    }
  };

  static deleteVariantById = async (req, res, next) => {
    try {
      await VariantService.deleteVariantBydId(req);

      SuccessResponse(res, StatusCodes.OK, 'deleted variant successfully', {});
    } catch (error) {
      next(error);
    }
  };
}
