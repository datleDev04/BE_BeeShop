import { StatusCodes } from 'http-status-codes'
import { ErrorLogger } from '../../../utils/ErrorLogger.js'
import { SuccessResponse } from '../../../utils/response.js'
import { Transform } from '../../helpers/transform.js'
import { brandService } from './brand.service.js'

const errorLogger = new ErrorLogger({
  logDir: 'src/api/client/brand',
});

export const brandController = {
  getAllBrands: async (req, res, next) => {
    try {
      const brands = await brandService.getAllBrands(req)
      SuccessResponse(res, StatusCodes.OK, "Success", Transform(brands))
    }catch(error) {
      errorLogger.logError(error, {
        function: 'getAllBrands',
      });
      next(error);
    }
  }
}