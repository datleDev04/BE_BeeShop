import { StatusCodes } from 'http-status-codes';
import BrandService from '../services/brand.service.js';
import { SuccessResponse } from '../utils/response.js';
import { Transformer } from '../utils/transformer.js';

export class BrandController {
  static createNewBrand = async (req, res, next) => {
    try {
      const newBrand = await BrandService.handleCreateBrand(req);

      SuccessResponse(res, StatusCodes.OK, 'Create new brand successfully', Transformer.transformObjectTypeSnakeToCamel(newBrand.toObject()));
    } catch (error) {
      next(error);
    }
  };

  static getAllBrand = async (req, res, next) => {
    try {
      const brands = await BrandService.handleGetAllBrand(req);

      const responseData = brands.map((brand) => {
        return Transformer.transformObjectTypeSnakeToCamel(brand.toObject());
      });

      SuccessResponse(res, StatusCodes.OK, 'Get all brand successfully', responseData);
    } catch (error) {
      next(error);
    }
  };

  static getOneBrand = async (req, res, next) => {
    try {
      const brand = await BrandService.handleGetOneBrand(req);

      SuccessResponse(res, StatusCodes.OK, 'Get one brand successfully', Transformer.transformObjectTypeSnakeToCamel(brand.toObject()));
    } catch (error) {
      next(error);
    }
  };

  static updateBrandById = async (req, res, next) => {
    try {
      const updateBrand = await BrandService.handleUpdateBrand(req);

      SuccessResponse(res, StatusCodes.OK, 'Update brand successfully', Transformer.transformObjectTypeSnakeToCamel(updateBrand.toObject()));
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
