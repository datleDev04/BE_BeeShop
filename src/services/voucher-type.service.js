import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/ApiError.js';
import VoucherType from '../models/Voucher_Type.js/index.js';
import Voucher from '../models/Voucher.js';

export default class VoucherTypeService {
  static createVoucherType = async (req) => {
    const { name } = req.body;

    const existedVoucherType = await VoucherType.findOne({ name });

    if (existedVoucherType) {
      throw new ApiError(StatusCodes.CONFLICT, 'This voucher type is existed');
    }

    const newVoucherTypes = await VoucherType.create({ name });

    return newVoucherTypes;
  };

  static getAllVoucherType = async (req) => {
    const voucherTypes = await VoucherType.find();
    return voucherTypes;
  };

  static getOneVoucherType = async (req) => {
    const voucherType = await VoucherType.findById(req.params.id);

    if (!voucherType) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Voucher type not found');
    }
    await VoucherType.findById(req.params.id);

    return voucherType;
  };

  static updateVoucherType = async (req) => {
    const { name } = req.body;

    const updatedVoucherType = await VoucherType.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true }
    );

    if (!updatedVoucherType) {
      throw new ApiError(StatusCodes.CONFLICT, 'This voucher type is not available');
    }

    return updatedVoucherType;
  };

  static deleteVoucherType = async (req) => {
    const voucherType = await VoucherType.findById(req.params.id);

    if (!voucherType) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Voucher type not found');
    }

    await VoucherType.findByIdAndDelete(req.params.id);

    return voucherType;
  };
}
