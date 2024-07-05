import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/ApiError.js';
import VoucherType from '../models/Voucher-Type.js';

export default class VoucherTypeService {
  static handleCreateVoucherType = async (req) => {
    const { name } = req.body;

    const existedVoucherType = await VoucherType.findOne({ name });

    if (existedVoucherType) {
      throw new ApiError(StatusCodes.CONFLICT, 'This voucher type is existed');
    }

    const newVoucherTypes = await VoucherType.create({ name });

    return newVoucherTypes;
  };

  static handleGetAllVoucherType = async (req) => {
    const voucherTypes = await VoucherType.find();
    return voucherTypes;
  };

  static handleGetOneVoucherType = async (req) => {
    const voucherType = await VoucherType.findById(req.params.id);

    if (!voucherType) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Voucher type not found');
    }
    await VoucherType.findById(req.params.id);

    return voucherType;
  };

  static handleUpdateVoucherType = async (req) => {
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

  static handleDeleteVoucherType = async (req) => {
    const voucherType = await VoucherType.findById(req.params.id);

    if (!voucherType) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Voucher type not found');
    }

    await VoucherType.findByIdAndDelete(req.params.id);

    return voucherType;
  };
}
