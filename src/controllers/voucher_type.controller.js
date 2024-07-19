import { StatusCodes } from 'http-status-codes';
import { SuccessResponse } from '../utils/response.js';
import VoucherTypeService from '../services/voucher_type.service.js';

export class VoucherTypeController {
  static getAllVoucherType = async (req, res, next) => {
    try {
      const { metaData, others } = await VoucherTypeService.getAllVoucherType(req);

      SuccessResponse(res, StatusCodes.OK, 'Get all voucher type successfully', metaData, others);
    } catch (error) {
      next(error);
    }
  };

  static getOneVoucherType = async (req, res, next) => {
    try {
      const voucherType = await VoucherTypeService.getOneVoucherType(req);

      SuccessResponse(res, StatusCodes.OK, 'Get one voucher type successfully', voucherType);
    } catch (error) {
      next(error);
    }
  };

  static createNewVoucherType = async (req, res, next) => {
    try {
      const newVoucherTypes = await VoucherTypeService.createVoucherType(req);

      SuccessResponse(res, StatusCodes.OK, 'Create new voucher type successfully', newVoucherTypes);
    } catch (error) {
      next(error);
    }
  };

  static updateVoucherTypeById = async (req, res, next) => {
    try {
      const updatedVoucherType = await VoucherTypeService.updateVoucherType(req);

      SuccessResponse(res, StatusCodes.OK, 'Updated voucher type successfully', updatedVoucherType);
    } catch (error) {
      next(error);
    }
  };

  static deleteVoucherTypeById = async (req, res, next) => {
    try {
      await VoucherTypeService.deleteVoucherType(req);

      SuccessResponse(res, StatusCodes.OK, 'Deleted voucher type successfully', []);
    } catch (error) {
      next(error);
    }
  };
}
