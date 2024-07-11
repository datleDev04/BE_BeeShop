import { StatusCodes } from 'http-status-codes';
import { SuccessResponse } from '../utils/response.js';
import { Transformer } from '../utils/transformer.js';
import { OrderStatusService } from '../services/order_status.service.js';

export class OrderStatusController {
  static getAllOrderStatus = async (req, res, next) => {
    try {
      const ordersStatus = await OrderStatusService.getAllOrderStatus(req);

      const returnData = ordersStatus.map((data) => {
        return Transformer.transformObjectTypeSnakeToCamel(data.toObject());
      });

      SuccessResponse(res, StatusCodes.OK, 'Get all order status successfully', returnData);
    } catch (error) {
      next(error);
    }
  };

  static getOneOrderStatus = async (req, res, next) => {
    try {
      const orderStatus = await OrderStatusService.getOneOrderStatus(req);

      SuccessResponse(
        res,
        StatusCodes.OK,
        'Get one order status successfully',
        Transformer.transformObjectTypeSnakeToCamel(orderStatus.toObject())
      );
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
        Transformer.transformObjectTypeSnakeToCamel(newOrderStatus.toObject())
      );
    } catch (error) {
      next(error);
    }
  };

  static updateOrderStatusById = async (req, res, next) => {
    try {
      const updatedOrderStatus = await OrderStatusService.updateOrderStatusById(req);

      SuccessResponse(
        res,
        StatusCodes.OK,
        'Updated order status successfully',
        Transformer.transformObjectTypeSnakeToCamel(updatedOrderStatus.toObject())
      );
    } catch (error) {
      next(error);
    }
  };

  static deleteOrderStatusById = async (req, res, next) => {
    try {
      const deletedOrderStatus = await OrderStatusService.deleteOrderStatusBydId(req);

      SuccessResponse(
        res,
        StatusCodes.OK,
        'Delete order status successfully',
        Transformer.transformObjectTypeSnakeToCamel(deletedOrderStatus.toObject())
      );
    } catch (error) {
      next(error);
    }
  };
}
