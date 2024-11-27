import { StatusCodes } from 'http-status-codes';
import { SuccessResponse } from '../../../utils/response.js';
import { statsService } from './stats.service.js';
import { Transform } from '../../helpers/transform.js';
import {
  mostOrdersTransform,
  mostPurchasedColorTransform,
  mostPurchasedSizeTransform,
} from './stats.transform.js';
import { ErrorLogger } from '../../../utils/ErrorLogger.js';
import { Transformer } from '../../../utils/transformer.js';

const errorLogger = new ErrorLogger({
  logDir: 'src/api/client/stats',
});

export const statsController = {
  getMostPurchasedSize: async (req, res, next) => {
    try {
      const result = await statsService.getMostPurchasedSize(req);

      SuccessResponse(
        res,
        StatusCodes.OK,
        'Success',
        Transform(result, mostPurchasedSizeTransform)
      );
    } catch (error) {
      errorLogger.logError(error, {
        function: 'getMostPurchasedSize',
      });
      next(error);
    }
  },
  getMostPurchasedColor: async (req, res, next) => {
    try {
      const result = await statsService.getMostPurchasedColor(req);

      SuccessResponse(
        res,
        StatusCodes.OK,
        'Success',
        Transform(result, mostPurchasedColorTransform)
      );
    } catch (error) {
      errorLogger.logError(error, {
        function: 'getMostPurchasedColor',
      });
      next(error);
    }
  },
  getAlmostOutOfStock: async (req, res, next) => {
    try {
      const result = await statsService.getAlmostOutOfStock();

      SuccessResponse(res, StatusCodes.OK, 'Success', Transform(result));
    } catch (error) {
      errorLogger.logError(error, {
        function: 'getAlmostOutOfStock',
      });
      next(error);
    }
  },
  getMostOrders: async (req, res, next) => {
    try {
      const result = await statsService.getMostOrders();

      SuccessResponse(res, StatusCodes.OK, 'Success', Transform(result, mostOrdersTransform));
    } catch (error) {
      errorLogger.logError(error, {
        function: 'getMostOrders',
      });
      next(error);
    }
  },
  getLatestReviews: async (req, res, next) => {
    try {
      const result = await statsService.getLatestReviewProduct(req);
      SuccessResponse(res, StatusCodes.OK, 'Success', result);
    } catch (error) {
      next(error);
    }
  },

  getOrderCountWithStatus: async (req, res, next) => {
    try {
      const result = await statsService.getOrderCountWithStatus();
      SuccessResponse(res, StatusCodes.OK, 'Success', result);
    } catch (error) {
      next(error);
    }
  },

  getRevenueByPeriod: async (req, res, next) => {
    try {
      const result = await statsService.getStatistics(req);
      SuccessResponse(
        res,
        StatusCodes.OK,
        'Success',
        Transformer.transformObjectTypeSnakeToCamel(result)
      );
    } catch (error) {
      next(error);
    }
  },
};
