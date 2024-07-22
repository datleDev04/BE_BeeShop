import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/ApiError.js';
import OrderStatus from '../models/Order_Status.js';
import { getFilterOptions, getPaginationOptions } from '../utils/pagination.js';
import { Transformer } from '../utils/transformer.js';
import { checkRecordByField } from '../utils/CheckRecord.js';

export class OrderStatusService {
  static getAllOrderStatus = async (req) => {
    const options = getPaginationOptions(req);
    const filter = getFilterOptions(req, ['name']);

    const paginatedLabels = await OrderStatus.paginate(filter, options);

    const { docs, ...otherFields } = paginatedLabels;

    const transformedLabels = docs.map((label) =>
      Transformer.transformObjectTypeSnakeToCamel(label.toObject())
    );

    const others = {
      ...otherFields,
    };

    return {
      metaData: Transformer.removeDeletedField(transformedLabels),
      others,
    };
  };

  static getOneOrderStatus = async (req) => {
    await checkRecordByField(OrderStatus, '_id', req.params.id, true);
    const orderStatus = await OrderStatus.findById(req.params.id);

    return Transformer.transformObjectTypeSnakeToCamel(orderStatus.toObject());
  };

  static createOrderStatus = async (req) => {
    const { name, description } = req.body;

    await checkRecordByField(OrderStatus, 'name', name, false);

    const newOrderStatus = await OrderStatus.create({
      name,
      description,
    });

    return Transformer.transformObjectTypeSnakeToCamel(newOrderStatus.toObject());
  };

  static updateOrderStatusById = async (req) => {
    const { name, description } = req.body;

    const { id } = req.params;
    await checkRecordByField(OrderStatus, 'name', name, false, id);

    await checkRecordByField(OrderStatus, '_id', id, true);

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

    return Transformer.transformObjectTypeSnakeToCamel(updatedOrderStatus.toObject());
  };

  static deleteOrderStatusBydId = async (req) => {
    const { id } = req.params;
    await checkRecordByField(OrderStatus, '_id', id, true);
    await OrderStatus.findByIdAndDelete(id);
  };
}
