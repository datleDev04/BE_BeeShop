import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/ApiError.js';
import PaymentStatus from '../models/Payment_Status.js';

export default class PaymentStatusService {
  static createNewPaymentStatus = async (req) => {
    const { name } = req.body;

    const existedPaymentStatus = await PaymentStatus.findOne({ name });

    if (existedPaymentStatus) {
      throw new ApiError(StatusCodes.CONFLICT, 'This payment status is existed');
    }

    const newPaymentStatus = await PaymentStatus.create({ name });
    return newPaymentStatus;
  };

  static getAllPaymentStatus = async (req) => {
    const paymentStatuses = await PaymentStatus.find().exec();
    return paymentStatuses;
  };

  static getOnePaymentStatus = async (req) => {
    const paymentStatus = await PaymentStatus.findById(req.params.id).exec();
    if (!paymentStatus) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Payment status not found');
    }
    return paymentStatus;
  };

  static updatePaymentStatusById = async (req) => {
    const { name } = req.body;

    const updatedPaymentStatus = await PaymentStatus.findByIdAndUpdate(
      req.params.id,
      {
        name,
      },
      { new: true }
    );

    if (!updatedPaymentStatus) {
      throw new ApiError(StatusCodes.CONFLICT, 'This payment status is not existing');
    }

    return updatedPaymentStatus;
  };

  static deletePaymentStatusById = async (req) => {
    const paymentStatus = await PaymentStatus.findByIdAndDelete(req.params.id);

    if (!paymentStatus) {
      throw new ApiError(404, 'Payment status not found');
    }
    return paymentStatus;
  };
}
