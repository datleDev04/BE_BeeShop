import { StatusCodes } from 'http-status-codes';
import { Transformer } from '../utils/transformer.js';
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
        Transformer.transformObjectTypeSnakeToCamel(newPaymentType.toObject())
      );
    } catch (error) {
      next(error);
    }
  };
  static getPaymentType = async (req, res, next) => {
    try {
      const paymentType = await PaymentTypeService.getOnePaymentType(req);

      SuccessResponse(
        res,
        StatusCodes.OK,
        'Get payment type successfully',
        Transformer.transformObjectTypeSnakeToCamel(paymentType.toObject())
      );
    } catch (error) {
      next(error);
    }
  };
  static getAllPaymentTypes = async (req, res, next) => {
    try {
      const paymentTypes = await PaymentTypeService.getAllPaymentType(req);

      const returnData = paymentTypes.map((paymentType) => {
        return Transformer.transformObjectTypeSnakeToCamel(paymentType.toObject());
      });

      SuccessResponse(res, StatusCodes.OK, 'Get All payment type successfully', returnData);
    } catch (error) {
      next(error);
    }
  };

  static updatePaymentType = async (req, res, next) => {
    try {
      const paymentTypes = await PaymentTypeService.updatePaymentTypeById(req);

      SuccessResponse(
        res,
        StatusCodes.OK,
        'Updated payment type successfully',
        Transformer.transformObjectTypeSnakeToCamel(paymentTypes.toObject())
      );
    } catch (error) {
      next(error);
    }
  };
  static deletePaymentType = async (req, res, next) => {
    try {
      const deletedPaymentType = await PaymentTypeService.deletePaymentTypeById(req);

      SuccessResponse(
        res,
        StatusCodes.OK,
        'Delete payment type successfully',
        Transformer.transformObjectTypeSnakeToCamel(deletedPaymentType.toObject())
      );
    } catch (error) {
      next(error);
    }
  };
}
