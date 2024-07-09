import { StatusCodes } from 'http-status-codes';
import { Transformer } from '../utils/transformer.js';
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
        Transformer.transformObjectTypeSnakeToCamel(newPaymentStatus.toObject())
      );
    } catch (error) {
      next(error);
    }
  };
  static getPaymentStatus = async (req, res, next) => {
    try {
      const paymentStatus = await PaymentStatusService.getOnePaymentStatus(req);

      SuccessResponse(
        res,
        StatusCodes.OK,
        'Get payment status successfully',
        Transformer.transformObjectTypeSnakeToCamel(paymentStatus.toObject())
      );
    } catch (error) {
      next(error);
    }
  };
  static getAllPaymentStatuses = async (req, res, next) => {
    try {
      const paymentStatuss = await PaymentStatusService.getAllPaymentStatus(req);

      const returnData = paymentStatuss.map((paymentStatus) => {
        return Transformer.transformObjectTypeSnakeToCamel(paymentStatus.toObject());
      });

      SuccessResponse(res, StatusCodes.OK, 'Get All Payment Status successfully', returnData);
    } catch (error) {
      next(error);
    }
  };

  static updatePaymentStatus = async (req, res, next) => {
    try {
      const paymentStatuss = await PaymentStatusService.updatePaymentStatusById(req);

      SuccessResponse(
        res,
        StatusCodes.OK,
        'Updated Payment status successfully',
        Transformer.transformObjectTypeSnakeToCamel(paymentStatuss.toObject())
      );
    } catch (error) {
      next(error);
    }
  };
  static deletePaymentStatus = async (req, res, next) => {
    try {
      const deletedPaymentStatus = await PaymentStatusService.deletePaymentStatusById(req);

      SuccessResponse(
        res,
        StatusCodes.OK,
        'Delete Payment status successfully',
        Transformer.transformObjectTypeSnakeToCamel(deletedPaymentStatus.toObject())
      );
    } catch (error) {
      next(error);
    }
  };
}
