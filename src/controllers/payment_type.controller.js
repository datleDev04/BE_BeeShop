import { StatusCodes } from 'http-status-codes';
import { SuccessResponse } from '../utils/response.js';
import PaymentTypeService from '../services/payment_type.service.js';

export class PaymentTypeController {
  static createNewPaymentType = async (req, res, next) => {
    try {
      const newPaymentType = await PaymentTypeService.createNewPaymentType(req);

      SuccessResponse(
        res,
        StatusCodes.CREATED,
        'Create new payment type successfully',
        newPaymentType
      );
    } catch (error) {
      next(error);
    }
  };
  static getPaymentType = async (req, res, next) => {
    try {
      const paymentType = await PaymentTypeService.getOnePaymentType(req);

      SuccessResponse(res, StatusCodes.OK, 'Get payment type successfully', paymentType);
    } catch (error) {
      next(error);
    }
  };
  static getAllPaymentTypes = async (req, res, next) => {
    try {
      const { metaData, others } = await PaymentTypeService.getAllPaymentType(req);

      SuccessResponse(res, StatusCodes.OK, 'Get All payment type successfully', metaData, others);
    } catch (error) {
      next(error);
    }
  };

  static updatePaymentType = async (req, res, next) => {
    try {
      const paymentType = await PaymentTypeService.updatePaymentTypeById(req);

      SuccessResponse(res, StatusCodes.OK, 'Updated payment type successfully', paymentType);
    } catch (error) {
      next(error);
    }
  };
  static deletePaymentType = async (req, res, next) => {
    try {
      const deletedPaymentType = await PaymentTypeService.deletePaymentTypeById(req);

      SuccessResponse(res, StatusCodes.OK, 'Delete payment type successfully', {});
    } catch (error) {
      next(error);
    }
  };
}
