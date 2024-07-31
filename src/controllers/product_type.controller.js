import { StatusCodes } from 'http-status-codes';
import { SuccessResponse } from '../utils/response.js';
import ProductTypeService from '../services/product_type.service.js';

export class ProductTypeController {
  static createNewProductType = async (req, res, next) => {
    try {
      const newProductType = await ProductTypeService.createProductType(req);

      SuccessResponse(
        res,
        StatusCodes.CREATED,
        'Create new product type successfully',
        newProductType
      );
    } catch (error) {
      next(error);
    }
  };
  static getProductType = async (req, res, next) => {
    try {
      const type = await ProductTypeService.getOneProductType(req);

      SuccessResponse(res, StatusCodes.OK, 'Get product type successfully', type);
    } catch (error) {
      next(error);
    }
  };
  static getAllProductTypes = async (req, res, next) => {
    try {
      const { metaData, others } = await ProductTypeService.getAllProductType(req);

      SuccessResponse(res, StatusCodes.OK, 'Get All ProductType successfully', metaData, others);
    } catch (error) {
      next(error);
    }
  };

  static updateProductType = async (req, res, next) => {
    try {
      const colors = await ProductTypeService.updateProductType(req);

      SuccessResponse(res, StatusCodes.OK, 'Updated product type successfully', colors);
    } catch (error) {
      next(error);
    }
  };

  static deleteProductType = async (req, res, next) => {
    try {
      await ProductTypeService.deleteProductType(req);
      SuccessResponse(res, StatusCodes.OK, 'Delete Product type successfully', {});
    } catch (error) {
      next(error);
    }
  };
}
