import { StatusCodes } from 'http-status-codes';
import { SuccessResponse } from '../utils/response.js';
import OrderLogService from '../services/order_log.service.js';

export class OrderLogController {
  static getLogsByOrderId = async (req, res, next) => {
    try {
      const { metaData } = await OrderLogService.getLogsByOrderId(req);
      SuccessResponse(res, StatusCodes.OK, 'Get Order logs success', metaData);
    } catch (error) {
      next(error);
    }
  };
}
