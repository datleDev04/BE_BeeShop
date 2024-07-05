import { StatusCodes } from 'http-status-codes';
import { SuccessResponse } from '../utils/response.js';
import VoucherService from '../services/voucher.service.js';

export class VoucherController {
  static getAllVouchers = async (req, res, next) => {
    try {
      const vouchers = await VoucherService.getAllVouchers();
      SuccessResponse(res, StatusCodes.OK, 'Get all vouchers successfully', vouchers);
    } catch (error) {
      next(error);
    }
  };

  static getOneVoucher = async (req, res, next) => {
    try {
      const voucher = await VoucherService.getOneVoucher(req.params.id);
      SuccessResponse(res, StatusCodes.OK, 'Get one voucher successfully', voucher);
    } catch (error) {
      next(error);
    }
  };

  static createVoucher = async (req, res, next) => {
    try {
      const newVoucher = await VoucherService.createVoucher(req);
      SuccessResponse(res, StatusCodes.CREATED, 'Create voucher successfully', newVoucher);
    } catch (error) {
      next(error);
    }
  };

  static updateVoucher = async (req, res, next) => {
    try {
      const updatedVoucher = await VoucherService.updateVoucher(req);
      SuccessResponse(res, StatusCodes.OK, 'Update voucher successfully', updatedVoucher);
    } catch (error) {
      next(error);
    }
  };

  static deleteVoucher = async (req, res, next) => {
    try {
      await VoucherService.deleteVoucher(req);

      SuccessResponse(res, StatusCodes.OK, 'Deleted voucher successfully', []);
    } catch (error) {
      next(error);
    }
  };
}
