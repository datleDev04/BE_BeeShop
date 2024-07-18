import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/ApiError.js';
import Voucher from '../models/Voucher.js';
import VoucherType from '../models/Voucher_Type.js';

export default class VoucherService {
  static createVoucher = async (req) => {
    const {
      name,
      code,
      max_usage,
      duration,
      discount,
      discount_types,
      minimum_order_price,
      start_date,
      end_date,
      voucher_type,
    } = req.body;

    const existedVoucher = await Voucher.findOne({ name });

    if (existedVoucher) {
      throw new ApiError(StatusCodes.CONFLICT, 'This voucher is existed');
    }

    const voucherType = await VoucherType.findById(voucher_type);
    if (!voucherType) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Voucher type not found');
    }

    const newVoucher = await Voucher.create({
      name,
      code,
      max_usage,
      duration,
      discount,
      discount_types,
      minimum_order_price,
      voucher_type,
      start_date,
      end_date,
    });

    const populatedVoucher = await Voucher.findById(newVoucher._id).populate('voucher_type').exec();
    return populatedVoucher;
  };

  static getAllVouchers = async () => {
    return await Voucher.find().populate('voucher_type').sort({ createdAt: -1 }).exec();
  };

  static getOneVoucher = async (id) => {
    const voucher = await Voucher.findById(id).populate('voucher_type').exec();
    if (!voucher) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Voucher not found');
    }
    return voucher;
  };

  static updateVoucher = async (req) => {
    const {
      name,
      code,
      max_usage,
      duration,
      discount,
      discount_types,
      minimum_order_price,
      voucher_type,
      start_date,
      end_date,
    } = req.body;

    const existedVoucher = await Voucher.findOne({ name });

    if (existedVoucher) {
      throw new ApiError(StatusCodes.CONFLICT, 'This voucher is existed');
    }

    const updatedVoucher = await Voucher.findByIdAndUpdate(
      req.params.id,
      {
        name,
        code,
        max_usage,
        duration,
        discount,
        discount_types,
        minimum_order_price,
        voucher_type,
        start_date,
        end_date,
      },
      { new: true, runValidators: true }
    )
      .populate('voucher_type')
      .exec();

    if (!updatedVoucher) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Voucher not found');
    }

    return updatedVoucher;
  };

  static deleteVoucher = async (req) => {
    const voucher = await Voucher.findById(req.params.id);

    if (!voucher) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Voucher not found');
    }

    await Voucher.findByIdAndDelete(req.params.id);

    return voucher;
  };
}
