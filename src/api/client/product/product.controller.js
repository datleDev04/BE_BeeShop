import { StatusCodes } from 'http-status-codes';
import { SuccessResponse } from '../../../utils/response.js';
import { productService } from './product.service.js';
import { detailTransform, listTransform } from './product.transform.js';
import { ErrorLogger } from '../../../utils/ErrorLogger.js';
import { Transform } from '../../helpers/transform.js';

const errorLogger = new ErrorLogger({
  logDir: 'src/api/client/product',
});

export const productController = {
  getAllProducts: async (req, res, next) => {
    try {
      const { products, totalDocs } = await productService.getAllProducts(req);
      SuccessResponse(
        res,
        StatusCodes.OK,
        'Get All Products Successfully',
        Transform(products, listTransform),
        { totalDocs }
      );
    } catch (error) {
      errorLogger.logError(error, {
        function: 'getAllProducts',
        query: `Query: ${JSON.stringify(req.query)}`,
      });
      next(error);
    }
  },
  getProductBySlug: async (req, res, next) => {
    try {
      const product = await productService.getProductBySlug(req);
      SuccessResponse(
        res,
        StatusCodes.OK,
        'Get Product Successfully',
        Transform(product, detailTransform)
      );
    } catch (error) {
      errorLogger.logError(error, {
        function: 'getProductBySlug',
        slug: `Query: ${JSON.stringify(req.params)}`,
      });
      next(error);
    }
  },
  getProductReviews: async (req, res, next) => {
    try {
      const reviews = await productService.getProductReviews(req);
      SuccessResponse(res, StatusCodes.OK, 'Get Reviews Successfully', Transform(reviews));
    } catch (error) {
      errorLogger.logError(error, {
        function: 'getProductBySlug',
        slug: `Query: ${JSON.stringify(req.params)}`,
      });
      next(error);
    }
  },
};
