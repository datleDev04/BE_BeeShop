import { StatusCodes } from 'http-status-codes';
import { SuccessResponse } from '../../../utils/response.js';
import { productService } from './product.service.js';
import { detailTransform, listTransform, TransformProduct } from './product.transform.js';
import { ErrorLogger } from '../../../utils/ErrorLogger.js'

const errorLogger = new ErrorLogger({
  logDir: 'src/api/client/product',
});

export const productController = {
  getAllProducts: async (req, res, next) => {
    try {
      const products = await productService.getAllProducts(req);
      SuccessResponse(res, StatusCodes.OK, 'Get All Products Successfully', TransformProduct(products, listTransform));
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
      const product = await productService.getProductBySlug(req)
      SuccessResponse(res, StatusCodes.OK, 'Get Product Successfully', TransformProduct(product, detailTransform));
    }catch(error) {
      errorLogger.logError(error, {
        function: 'getProductBySlug',
        slug: `Query: ${JSON.stringify(req.params)}`,
      });
      next(error);
    }
  }
};
