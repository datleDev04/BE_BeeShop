import { StatusCodes } from 'http-status-codes';
import { SuccessResponse } from '../../../utils/response.js';
import { productService } from './product.service.js';
import { TransformProduct } from './product.transform.js';
import { ErrorLogger } from '../../../utils/ErrorLogger.js'

const errorLogger = new ErrorLogger({
  logDir: 'src/api/client/product',
});

export const productController = {
  getAllProducts: async (req, res, next) => {
    try {
      const products = await productService.getAllProducts(req);
      SuccessResponse(res, StatusCodes.OK, 'Get All Products OK', TransformProduct(products));
    } catch (error) {
      errorLogger.logError(error, {
        function: 'getAllProducts',
        query: `Query: ${JSON.stringify(req.query)}`,
      });
      next(error);
    }
  },
};
