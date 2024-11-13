import { StatusCodes } from 'http-status-codes';
import { SuccessResponse } from '../../../utils/response.js';
import { statsService } from './stats.service.js';
import { Transform } from '../../helpers/transform.js';
import { mostPurchasedColorTransform, mostPurchasedSizeTransform } from './stats.transform.js';
import { ErrorLogger } from '../../../utils/ErrorLogger.js'

const errorLogger = new ErrorLogger({
  logDir: 'src/api/client/stats',
});

export const statsController = {
  getMostPurchasedSize: async (req, res, next) => {
    try {
      const result = await statsService.getMostPurchasedSize();

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
      const result = await statsService.getMostPurchasedColor();

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
};
