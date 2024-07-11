import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/ApiError.js';
import OrderStatus from '../models/Order_Status.js';

export class OrderStatusService {
  static getAllOrderStatus = async (req) => {
    return await OrderStatus.find();
  };

  static getOneOrderStatus = async (req) => {
    const orderStatus = await OrderStatus.findById(req.params.id);

    if (!orderStatus) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Order Status not found');
    }

    return orderStatus;
  };

  static createOrderStatus = async (req) => {
    const { name, description } = req.body;

    const existingOrderStatus = await OrderStatus.findOne({ name });

    if (existingOrderStatus) {
      throw new ApiError(StatusCodes.CONFLICT, 'Order Status already exists');
    }

    const newOrderStatus = await OrderStatus.create({
      name,
      description,
    });

    return newOrderStatus;
  };

  static updateOrderStatusById = async (req) => {
    const { name, description } = req.body;
    const updatedOrderStatus = await OrderStatus.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedOrderStatus) {
      throw new ApiError(StatusCodes.CONFLICT, 'This payment status is not existing');
    }

    return updatedOrderStatus;
  };

  static deleteOrderStatusBydId = async (req) => {
    const deletedOrderStatus = await OrderStatus.findByIdAndDelete(req.params.id);

    if (!deletedOrderStatus) {
      throw new ApiError(404, 'Order status not found');
    }

    return deletedOrderStatus;
  };
}
