import { StatusCodes } from 'http-status-codes';
import { SuccessResponse } from '../utils/response.js';
import ProductService from '../services/product.services.js';

export class ProductController {
  static createNewProduct = async (req, res, next) => {
    try {
      const newProduct = await ProductService.createNewProduct(req);

      SuccessResponse(res, StatusCodes.CREATED, 'Create new Product successfully', newProduct);
    } catch (error) {
      next(error);
    }
  };
  static getAllProduct = async (req, res, next) => {
    try {
      const { metaData, others } = await ProductService.getAllProduct(req);

      SuccessResponse(res, StatusCodes.CREATED, 'Get all product successfully!', metaData, others);
    } catch (error) {
      next(error);
    }
  };
  static getOneProduct = async (req, res, next) => {
    try {
      const product = await ProductService.getOneProduct(req);

      SuccessResponse(res, StatusCodes.CREATED, 'Get one product successfully!', product);
    } catch (error) {
      next(error);
    }
  };
  static updateProduct = async (req, res, next) => {
    try {
      const product = await ProductService.updateProduct(req);

      SuccessResponse(res, StatusCodes.CREATED, 'Updated product successfully!', product);
    } catch (error) {
      next(error);
    }
  };
  static deleteProduct = async (req, res, next) => {
    try {
      await ProductService.deleteProduct(req);

      SuccessResponse(res, StatusCodes.CREATED, 'Deleted product successfully', {});
    } catch (error) {
      next(error);
    }
  };
}
