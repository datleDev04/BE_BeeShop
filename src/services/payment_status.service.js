import PaymentStatus from '../models/Payment_Status.js';
import { checkRecordByField } from '../utils/CheckRecord.js';
import { Transformer } from '../utils/transformer.js';

export default class PaymentStatusService {
  static createNewPaymentStatus = async (req) => {
    const { name } = req.body;

    await checkRecordByField(PaymentStatus, 'name', name, false);

    const newPaymentStatus = await PaymentStatus.create({ name });
    return Transformer.transformObjectTypeSnakeToCamel(newPaymentStatus.toObject());
  };

  static getAllPaymentStatus = async (req) => {
    const paymentStatuses = await PaymentStatus.find().sort({ createdAt: -1 }).exec();
    const returnData = paymentStatuses.map((status) => {
      return Transformer.transformObjectTypeSnakeToCamel(status.toObject());
    });
    return returnData;
  };

  static getOnePaymentStatus = async (req) => {
    await checkRecordByField(PaymentStatus, '_id', req.params.id, true);
    const paymentStatus = await PaymentStatus.findById(req.params.id).exec();

    return Transformer.transformObjectTypeSnakeToCamel(paymentStatus.toObject());
  };

  static updatePaymentStatusById = async (req) => {
    const { name } = req.body;

    await checkRecordByField(PaymentStatus, '_id', req.params.id, true);
    await checkRecordByField(PaymentStatus, 'name', name, false, req.params.id);

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
