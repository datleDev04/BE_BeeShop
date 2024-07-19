import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/ApiError.js';
import PaymentType from '../models/Payment_Type.js';
import { Transformer } from '../utils/transformer.js';
import { checkRecordByField } from '../utils/CheckRecord.js';

export default class PaymentTypeService {
  static createNewPaymentType = async (req) => {
    const { name } = req.body;

    await checkRecordByField(PaymentType, 'name', name, false);

    const newPaymentType = await PaymentType.create({ name });
    return Transformer.transformObjectTypeSnakeToCamel(newPaymentType.toObject());
  };

  static getAllPaymentType = async (req) => {
    const paymentTypes = await PaymentType.find().sort({ createdAt: -1 }).exec();
    const returnData = paymentTypes.map((type) => {
      return Transformer.transformObjectTypeSnakeToCamel(type.toObject());
    });
    return returnData;
  };

  static getOnePaymentType = async (req) => {
    await checkRecordByField(PaymentType, '_id', req.params.id, true);
    const paymentType = await PaymentType.findById(req.params.id).exec();

    return Transformer.transformObjectTypeSnakeToCamel(paymentType.toObject());
  };

  static updatePaymentTypeById = async (req) => {
    const { name } = req.body;

    await checkRecordByField(PaymentType, '_id', req.params.id, true);
    await checkRecordByField(PaymentType, 'name', name, false, req.params.id);

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
