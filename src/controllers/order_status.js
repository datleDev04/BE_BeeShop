import { StatusCodes } from 'http-status-codes';
import { SuccessResponse } from '../utils/response.js';
import { OrderStatusService } from '../services/order_status.service.js';

export class OrderStatusController {
  static getAllOrderStatus = async (req, res, next) => {
    try {
      const { metaData, others } = await OrderStatusService.getAllOrderStatus(req);

      SuccessResponse(res, StatusCodes.OK, 'Get all order status successfully', metaData, others);
    } catch (error) {
      next(error);
    }
  };

  static getOneOrderStatus = async (req, res, next) => {
    try {
      const orderStatus = await OrderStatusService.getOneOrderStatus(req);

      SuccessResponse(res, StatusCodes.OK, 'Get one order status successfully', orderStatus);
    } catch (error) {
      next(error);
    }
  };

  static createOrderStatus = async (req, res, next) => {
    try {
      const newOrderStatus = await OrderStatusService.createOrderStatus(req);
      SuccessResponse(
        res,
        StatusCodes.CREATED,
        'Create new order status successfully',
        newOrderStatus
      );
    } catch (error) {
      next(error);
    }
  };

  static updateOrderStatusById = async (req, res, next) => {
    try {
      const updatedOrderStatus = await OrderStatusService.updateOrderStatusById(req);

      SuccessResponse(res, StatusCodes.OK, 'Updated order status successfully', updatedOrderStatus);
    } catch (error) {
      next(error);
    }
  };

  static deleteOrderStatusById = async (req, res, next) => {
    try {
      await OrderStatusService.deleteOrderStatusBydId(req);

      SuccessResponse(res, StatusCodes.OK, 'Delete order status successfully', {});
    } catch (error) {
      next(error);
    }
  };
}
