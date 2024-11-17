import { StatusCodes } from 'http-status-codes'
import { ErrorLogger } from '../../../utils/ErrorLogger.js'
import { SuccessResponse } from '../../../utils/response.js'
import { Transform } from '../../helpers/transform.js'
import { labelService } from './label.service.js'

const errorLogger = new ErrorLogger({
  logDir: 'src/api/client/label',
});

export const labelController = {
  getAllLabels: async (req, res, next) => {
    try {
      const labels = await labelService.getAllLabels(req)
      SuccessResponse(res, StatusCodes.OK, "Success", Transform(labels))
    }catch(error) {
      errorLogger.logError(error, {
        function: 'getAllLabels',
      });
      next(error);
    }
  }
}