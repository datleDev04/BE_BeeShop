import { Transformer } from '../utils/transformer.js';
import { getFilterOptions, getPaginationOptions } from '../utils/pagination.js';
import { checkRecordByField } from '../utils/CheckRecord.js';
import ShippingMethod from '../models/Shipping_Method.js';

export default class ShippingMethodService {
  static createShippingMethod = async (req) => {
    const { name, cost, estimated_delivery_time } = req.body;

    await checkRecordByField(ShippingMethod, 'name', name, false);

    const newShippingMethod = await ShippingMethod.create({
      name,
      cost,
      estimated_delivery_time,
    });

    return Transformer.transformObjectTypeSnakeToCamel(newShippingMethod.toObject());
  };

  static getAllShippingMethods = async (req) => {
    const options = getPaginationOptions(req);
    const filter = getFilterOptions(req, ['name']);

    const paginatedMethods = await ShippingMethod.paginate(filter, options);

    const { docs, ...otherFields } = paginatedMethods;

    const transformedMethods = docs.map((method) =>
      Transformer.transformObjectTypeSnakeToCamel(method.toObject())
    );

    const others = {
      ...otherFields,
    };

    return {
      metaData: Transformer.removeDeletedField(transformedMethods),
      others,
    };
  };

  static getOneShippingMethod = async (req) => {
    await checkRecordByField(ShippingMethod, '_id', req.params.id, true);
    const method = await ShippingMethod.findById(req.params.id);
    return Transformer.transformObjectTypeSnakeToCamel(method.toObject());
  };

  static updateShippingMethod = async (req) => {
    const { name, cost, estimated_delivery_time } = req.body;

    await checkRecordByField(ShippingMethod, '_id', req.params.id, true);

    if (name) {
      await checkRecordByField(ShippingMethod, 'name', name, false, req.params.id);
    }

    const updatedShippingMethod = await ShippingMethod.findByIdAndUpdate(
      req.params.id,
      { name, cost, estimated_delivery_time },
      { new: true, runValidators: true }
    );

    return Transformer.transformObjectTypeSnakeToCamel(updatedShippingMethod.toObject());
  };

  static deleteShippingMethod = async (req) => {
    await checkRecordByField(ShippingMethod, '_id', req.params.id, true);
    return await ShippingMethod.findByIdAndDelete(req.params.id);
  };
}
