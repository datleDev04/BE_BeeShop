import { StatusCodes } from 'http-status-codes';
import { SuccessResponse } from '../utils/response.js';
import PaymentStatusService from '../services/payment_status.service.js';

export class PaymentStatusController {
  static createNewPaymentStatus = async (req, res, next) => {
    try {
      const newPaymentStatus = await PaymentStatusService.createNewPaymentStatus(req);

      SuccessResponse(
        res,
        StatusCodes.CREATED,
        'Create new payment status successfully',
        newPaymentStatus
      );
    } catch (error) {
      next(error);
    }
  };
  static getPaymentStatus = async (req, res, next) => {
    try {
      const paymentStatus = await PaymentStatusService.getOnePaymentStatus(req);

      SuccessResponse(res, StatusCodes.OK, 'Get payment status successfully', paymentStatus);
    } catch (error) {
      next(error);
    }
  };
  static getAllPaymentStatuses = async (req, res, next) => {
    try {
      const { metaData, others } = await PaymentStatusService.getAllPaymentStatus(req);

      SuccessResponse(res, StatusCodes.OK, 'Get All Payment Status successfully', metaData, others);
    } catch (error) {
      next(error);
    }
  };

  static updatePaymentStatus = async (req, res, next) => {
    try {
      const paymentStatus = await PaymentStatusService.updatePaymentStatusById(req);

      SuccessResponse(res, StatusCodes.OK, 'Updated Payment status successfully', paymentStatus);
    } catch (error) {
      next(error);
    }
  };
  static deletePaymentStatus = async (req, res, next) => {
    try {
      await PaymentStatusService.deletePaymentStatusById(req);

      SuccessResponse(res, StatusCodes.OK, 'Delete Payment status successfully', {});
    } catch (error) {
      next(error);
    }
  };
}
