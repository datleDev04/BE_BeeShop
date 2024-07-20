import { StatusCodes } from 'http-status-codes';
import BrandService from '../services/brand.service.js';
import { SuccessResponse } from '../utils/response.js';

export class BrandController {
  static createNewBrand = async (req, res, next) => {
    try {
      const newBrand = await BrandService.handleCreateBrand(req);

      SuccessResponse(res, StatusCodes.OK, 'Create new brand successfully', newBrand);
    } catch (error) {
      next(error);
    }
  };

  static getAllBrand = async (req, res, next) => {
    try {
      const { metaData, others } = await BrandService.handleGetAllBrand(req);

      SuccessResponse(res, StatusCodes.OK, 'Get all brand successfully', metaData, others);
    } catch (error) {
      next(error);
    }
  };

  static getOneBrand = async (req, res, next) => {
    try {
      const brand = await BrandService.handleGetOneBrand(req);

      SuccessResponse(res, StatusCodes.OK, 'Get one brand successfully', brand);
    } catch (error) {
      next(error);
    }
  };

  static updateBrandById = async (req, res, next) => {
    try {
      const updateBrand = await BrandService.handleUpdateBrand(req);

      SuccessResponse(res, StatusCodes.OK, 'Update brand successfully', updateBrand);
    } catch (error) {
      next(error);
    }
  };

  static deleteBrandById = async (req, res, next) => {
    try {
      await BrandService.handleDeleteBrand(req);

      SuccessResponse(res, StatusCodes.OK, 'Deleted brand successfully', []);
    } catch (error) {
      next(error);
    }
  };
}
