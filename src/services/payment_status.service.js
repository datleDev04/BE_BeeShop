import PaymentStatus from '../models/Payment_Status.js';
import { checkRecordByField } from '../utils/CheckRecord.js';
import { getFilterOptions, getPaginationOptions } from '../utils/pagination.js';
import { Transformer } from '../utils/transformer.js';

export default class PaymentStatusService {
  static createNewPaymentStatus = async (req) => {
    const { name } = req.body;

    await checkRecordByField(PaymentStatus, 'name', name, false);

    const newPaymentStatus = await PaymentStatus.create({ name });
    return Transformer.transformObjectTypeSnakeToCamel(newPaymentStatus.toObject());
  };

  static getAllPaymentStatus = async (req) => {
    const options = getPaginationOptions(req);
    const filter = getFilterOptions(req, ['name']);

    const paginatedPaymentStatus = await PaymentStatus.paginate(filter, options);

    const { docs, ...otherFields } = paginatedPaymentStatus;

    const transformedPaymentStatus = docs.map((label) =>
      Transformer.transformObjectTypeSnakeToCamel(label.toObject())
    );

    const others = {
      ...otherFields,
    };

    return {
      metaData: Transformer.removeDeletedField(transformedPaymentStatus),
      others,
    };
  };

  static getOnePaymentStatus = async (req) => {
    await checkRecordByField(PaymentStatus, '_id', req.params.id, true);
    const paymentStatus = await PaymentStatus.findById(req.params.id).exec();

    return Transformer.transformObjectTypeSnakeToCamel(paymentStatus.toObject());
  };

  static updatePaymentStatusById = async (req) => {
    const { name } = req.body;

    await checkRecordByField(PaymentStatus, 'name', name, false, req.params.id);
    await checkRecordByField(PaymentStatus, '_id', req.params.id, true);

    const updatedPaymentStatus = await PaymentStatus.findByIdAndUpdate(
      req.params.id,
      {
        name,
      },
      { new: true }
    );

    return Transformer.transformObjectTypeSnakeToCamel(updatedPaymentStatus.toObject());
  };

  static deletePaymentStatusById = async (req) => {
    await checkRecordByField(PaymentStatus, '_id', req.params.id, true);
    return await PaymentStatus.findByIdAndDelete(req.params.id);
  };
}
