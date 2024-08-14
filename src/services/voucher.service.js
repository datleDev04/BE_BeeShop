import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/ApiError.js';
import Voucher from '../models/Voucher.js';
import VoucherType from '../models/Voucher_Type.js';
import { getFilterOptions, getPaginationOptions } from '../utils/pagination.js';
import { Transformer } from '../utils/transformer.js';
import { checkRecordByField } from '../utils/CheckRecord.js';

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

    await checkRecordByField(Voucher, 'name', name, false, req.params.id);
    await checkRecordByField(Voucher, 'code', code, false, req.params.id);

    const voucherType = await VoucherType.findById(voucher_type);
    if (!voucherType) {
      throw new ApiError(StatusCodes.NOT_FOUND, {
        voucher_type: 'Voucher type not found',
      });
    }

    if (voucherType.name === 'deadline') {
      if (!start_date || !end_date) {
        throw new ApiError(StatusCodes.BAD_REQUEST, {
          voucher_type: 'Start date and end date are required for deadline voucher type',
        });
      }
      const newVoucher = await Voucher.create({
        name,
        code,
        max_usage,
        discount,
        discount_types,
        minimum_order_price,
        voucher_type,
        start_date,
        end_date,
      });

      const populatedVoucher = await Voucher.findById(newVoucher._id)
        .populate('voucher_type')
        .exec();
      return Transformer.transformObjectTypeSnakeToCamel(populatedVoucher.toObject());
    } else if (voucherType.name === 'period') {
      if (!duration) {
        throw new ApiError(StatusCodes.BAD_REQUEST, {
          voucher_type: 'Duration is required for period voucher type',
        });
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
      });

      const populatedVoucher = await Voucher.findById(newVoucher._id)
        .populate('voucher_type')
        .exec();
      return Transformer.transformObjectTypeSnakeToCamel(populatedVoucher.toObject());
    } else {
      throw new ApiError(StatusCodes.BAD_REQUEST, {
        voucher_type: 'Invalid voucher type',
      });
    }
  };

  static getAllVouchers = async (req) => {
    const options = getPaginationOptions(req);
    const filter = getFilterOptions(req, ['name', 'status']);

    const paginatedVouchers = await Voucher.paginate(filter, {
      ...options,
      populate: 'voucher_type',
    });

    const { docs, ...otherFields } = paginatedVouchers;

    const transformedVouchers = docs.map((voucher) =>
      Transformer.transformObjectTypeSnakeToCamel(voucher.toObject())
    );

    const others = {
      ...otherFields,
    };

    return {
      metaData: Transformer.removeDeletedField(transformedVouchers),
      others,
    };
  };

  static getOneVoucher = async (req) => {
    await checkRecordByField(Voucher, '_id', req.params.id, true);
    const voucher = await Voucher.findById(req.params.id).populate('voucher_type').exec();

    return Transformer.transformObjectTypeSnakeToCamel(voucher.toObject());
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
      status,
      start_date,
      end_date,
    } = req.body;

    const voucherId = req.params.id;

    await checkRecordByField(Voucher, 'name', name, false, req.params.id);
    await checkRecordByField(Voucher, 'code', code, false, req.params.id);

    const voucherType = await VoucherType.findById(voucher_type);
    if (!voucherType) {
      throw new ApiError(StatusCodes.NOT_FOUND, {
        voucher_type: 'Voucher type not found',
      });
    }

    let updatedVoucherData = {
      name,
      code,
      max_usage,
      discount,
      discount_types,
      status,
      minimum_order_price,
      voucher_type,
    };

    if (voucherType.name === 'deadline') {
      if (!start_date || !end_date) {
        throw new ApiError(StatusCodes.BAD_REQUEST, {
          voucher_type: 'Start date and end date are required for deadline voucher type',
        });
      }
      updatedVoucherData = {
        ...updatedVoucherData,
        start_date,
        end_date,
      };
      await Voucher.updateOne({ _id: voucherId }, { $unset: { duration: '' } });
    } else if (voucherType.name === 'period') {
      if (!duration) {
        throw new ApiError(StatusCodes.BAD_REQUEST, {
          voucher_type: 'Duration is required for period voucher type',
        });
      }
      updatedVoucherData = {
        ...updatedVoucherData,
        duration,
      };
      await Voucher.updateOne({ _id: voucherId }, { $unset: { start_date: '', end_date: '' } });
    } else {
      throw new ApiError(StatusCodes.BAD_REQUEST, {
        voucher_type: 'Invalid voucher type',
      });
    }

    const updatedVoucher = await Voucher.findByIdAndUpdate(voucherId, updatedVoucherData, {
      new: true,
      runValidators: true,
    })
      .populate('voucher_type')
      .exec();

    if (!updatedVoucher) {
      throw new ApiError(StatusCodes.NOT_FOUND, {
        not_available: 'Voucher not found',
      });
    }

    return Transformer.transformObjectTypeSnakeToCamel(updatedVoucher.toObject());
  };

  static deleteVoucher = async (req) => {
    await checkRecordByField(Voucher, '_id', req.params.id, true);
    await Voucher.findByIdAndDelete(req.params.id);
  };
}
