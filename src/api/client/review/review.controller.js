import { StatusCodes } from 'http-status-codes'
import { ErrorLogger } from '../../../utils/ErrorLogger.js';
import { SuccessResponse } from '../../../utils/response.js'
import { reviewService } from './review.service.js'
import { Transform } from '../../helpers/transform.js'

const errorLogger = new ErrorLogger({
  logDir: 'src/api/client/review',
});

export const reviewController = {
  addReview: async (req, res, next) => {
    try {
      const review = await reviewService.addReview(req)
      SuccessResponse(res, StatusCodes.OK, 'Success', Transform(review))
    } catch (error) {
      errorLogger.logError(error, {
        function: 'addReview',
        body: `Body: ${JSON.stringify(req.body)}`
      });
      next(error);
    }
  },
  deleteReview: async (req, res, next) => {
    try {
      const deleteResult = await reviewService.deleteReview(req)
      SuccessResponse(res, StatusCodes.OK, 'Success', Transform(deleteResult))
    }catch (error) {
      errorLogger.logError(error, {
        function: 'deleteReview',
        params: `Params: ${JSON.stringify(req.params)}`
      });
      next(error)
    }
  }
};
