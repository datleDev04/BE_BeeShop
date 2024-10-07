import { StatusCodes } from 'http-status-codes';
import { SuccessResponse } from '../utils/response.js';
import OrderService from '../services/order.service.js';

export class OrderController {
  static getAllOrders = async (req, res, next) => {
    try {
      const { metaData, others } = await OrderService.getAllOrders(req, res);

      SuccessResponse(res, StatusCodes.OK, 'Get all order successfully', metaData, others);
    } catch (error) {
      next(error);
    }
  };

  static getOneOrder = async (req, res, next) => {
    try {
      const order = await OrderService.getOneOrder(req);

      SuccessResponse(res, StatusCodes.OK, 'Get one order successfully', order);
    } catch (error) {
      next(error);
    }
  };

  static getOrderByUser = async (req, res, next) => {
    try {
      const { metaData, others } = await OrderService.getOrderByUser(req);

      SuccessResponse(res, StatusCodes.OK, 'Get order by user successfully', metaData, others);
    } catch (error) {
      next(error);
    }
  };

  static createOrder = async (req, res, next) => {
    try {
      const paymentLink = await OrderService.createNewOrder(req, res);
      SuccessResponse(res, StatusCodes.OK, 'Create order successfully', paymentLink);
    } catch (error) {
      console;
      next(error);
    }
  };

  static updateOrderById = async (req, res, next) => {
    try {
      const order = await OrderService.updateOrderById(req, res);
      SuccessResponse(res, StatusCodes.OK, 'Update order successfully', order);
    } catch (error) {
      console;
      next(error);
    }
  };

  static rePayment = async (req, res, next) => {
    try {
      const paymentOptions = await OrderService.rePayment(req);
      SuccessResponse(res, StatusCodes.OK, 'Re-payment order successfully', paymentOptions);
    } catch (error) {
      console;
      next(error);
    }
  };

  static reOrder = async (req, res, next) => {
    try {
      const url = await OrderService.reOrder(req);
      SuccessResponse(res, StatusCodes.OK, 'Re-order successfully', url);
    } catch (error) {
      console;
      next(error);
    }
  };
}
