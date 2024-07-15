import { StatusCodes } from 'http-status-codes';
import { Transformer } from '../utils/transformer.js';
import { SuccessResponse } from '../utils/response.js';
import ProductService from '../services/product.services.js';

export class ProductController {
  static createNewProduct = async (req, res, next) => {
    try {
      const newProduct = await ProductService.createNewProduct(req);

      SuccessResponse(
        res,
        StatusCodes.CREATED,
        'Create new Product successfully',
        Transformer.transformObjectTypeSnakeToCamel(newProduct.toObject())
      );
    } catch (error) {
      next(error);
    }
  };
  static getAllProduct = async (req, res, next) => {
    try {
      const products = await ProductService.getAllProduct(req);

      const returnData = products.map((role) => {
        return Transformer.transformObjectTypeSnakeToCamel(role.toObject());
      });

      SuccessResponse(res, StatusCodes.CREATED, 'Get all product successfully!', returnData);
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
      const product = await ProductService.deleteProduct(req);

      SuccessResponse(res, StatusCodes.CREATED, 'Deleted product successfully');
    } catch (error) {
      next(error);
    }
  };
}
