import { StatusCodes } from 'http-status-codes';
import { SuccessResponse } from '../../utils/response.js';
import ShippingClientServive from '../../services/client/shipping.service.js';

export class ShippingClientController {
  static calculateShippingFee = async (req, res, next) => {
    try {
      const data = await ShippingClientServive.calculateShippingFee(req);

      SuccessResponse(res, StatusCodes.OK, 'Calculate shipping fee ok', data);
    } catch (error) {
      next(error);
    }
  };
}
