import PaymentType from '../models/Payment_Type.js';
import { Transformer } from '../utils/transformer.js';
import { checkRecordByField } from '../utils/CheckRecord.js';
import { getFilterOptions, getPaginationOptions } from '../utils/pagination.js';

export default class PaymentTypeService {
  static createNewPaymentType = async (req) => {
    const { name } = req.body;

    await checkRecordByField(PaymentType, 'name', name, false);

    const newPaymentType = await PaymentType.create({ name });
    return Transformer.transformObjectTypeSnakeToCamel(newPaymentType.toObject());
  };

  static getAllPaymentType = async (req) => {
    const options = getPaginationOptions(req);
    const filter = getFilterOptions(req, ['name']);

    const paginatedPaymentTypes = await PaymentType.paginate(filter, options);

    const { docs, ...otherFields } = paginatedPaymentTypes;

    const transformedPaymentTypes = docs.map((label) =>
      Transformer.transformObjectTypeSnakeToCamel(label.toObject())
    );

    const others = {
      ...otherFields,
    };

    return {
      metaData: Transformer.removeDeletedField(transformedPaymentTypes),
      others,
    };
  };

  static getOnePaymentType = async (req) => {
    await checkRecordByField(PaymentType, '_id', req.params.id, true);
    const paymentType = await PaymentType.findById(req.params.id).exec();

    return Transformer.transformObjectTypeSnakeToCamel(paymentType.toObject());
  };

  static updatePaymentTypeById = async (req) => {
    const { name } = req.body;

    await checkRecordByField(PaymentType, 'name', name, false, req.params.id);
    await checkRecordByField(PaymentType, '_id', req.params.id, true);

    const updatedPaymentType = await PaymentType.findByIdAndUpdate(
      req.params.id,
      {
        name,
      },
      { new: true }
    );

    return Transformer.transformObjectTypeSnakeToCamel(updatedPaymentType.toObject());
  };

  static deletePaymentTypeById = async (req) => {
    await checkRecordByField(PaymentType, '_id', req.params.id, true);

    return await PaymentType.findByIdAndDelete(req.params.id);
  };
}
