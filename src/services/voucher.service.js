import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/ApiError.js';
import Voucher from '../models/Voucher.js';
import VoucherType from '../models/Voucher-Type.js';

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
    } = req.body;

    const voucherTypes = await VoucherType.find();
    if (!voucherTypes.length) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'No voucher types found');
    }

    const voucherTypeIds = voucherTypes.map((vt) => vt._id);

    const newVoucher = await Voucher.create({
      name,
      code,
      max_usage,
      duration,
      discount,
      discount_types,
      minimum_order_price,
      voucher_type: voucherTypeIds,
      start_date,
      end_date,
    });

    const populatedVoucher = await Voucher.findById(newVoucher._id).populate('voucher_type').exec();
    return populatedVoucher;
  };

  static getAllVouchers = async () => {
    return await Voucher.find().populate('voucher_type').exec();
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
