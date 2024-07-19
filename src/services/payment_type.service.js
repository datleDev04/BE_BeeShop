import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/ApiError.js';
import PaymentType from '../models/Payment_Type.js';

export default class PaymentTypeService {
  static createNewPaymentType = async (req) => {
    const { name } = req.body;

    const existedPaymentType = await PaymentType.findOne({ name });

    if (existedPaymentType) {
      throw new ApiError(StatusCodes.CONFLICT, 'This payment type is existed');
    }

    const newPaymentType = await PaymentType.create({ name });
    return newPaymentType;
  };

  static getAllPaymentType = async (req) => {
    const paymentTypes = await PaymentType.find().sort({ createdAt: -1 }).exec();
    return paymentTypes;
  };

  static getOnePaymentType = async (req) => {
    const paymentType = await PaymentType.findById(req.params.id).exec();
    if (!paymentType) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Payment type not found');
    }
    return paymentType;
  };

  static updatePaymentTypeById = async (req) => {
    const { name } = req.body;

    const existedPaymentType = await PaymentType.findOne({ name });

    if (existedPaymentType) {
      throw new ApiError(StatusCodes.CONFLICT, 'This payment type is existed');
    }

    const updatedPaymentType = await PaymentType.findByIdAndUpdate(
      req.params.id,
      {
        name,
      },
      { new: true }
    );

    if (!updatedPaymentType) {
      throw new ApiError(StatusCodes.CONFLICT, 'This payment type is not existing');
    }

    return updatedPaymentType;
  };

  static deletePaymentTypeById = async (req) => {
    const paymentType = await PaymentType.findByIdAndDelete(req.params.id);

    if (!paymentType) {
      throw new ApiError(404, 'Payment type not found');
    }
    return paymentType;
  };
}
