import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/ApiError.js';
import Voucher, { VOUCHER_TYPES } from '../models/Voucher.js';
import { getFilterOptions, getPaginationOptions } from '../utils/pagination.js';
import { Transformer } from '../utils/transformer.js';
import { checkRecordByField } from '../utils/CheckRecord.js';
import { STATUS } from '../utils/constants.js';

export default class VoucherService {
  static createVoucher = async (req) => {
    const {
      name,
      code,
      max_usage,
      discount,
      discount_types,
      minimum_order_price,
      start_date,
      max_reduce,
      end_date,
      voucher_type,
    } = req.body;

    await checkRecordByField(Voucher, 'name', name, false, req.params.id);
    await checkRecordByField(Voucher, 'code', code, false, req.params.id);

    if (discount_types != 'percentage') {
      max_reduce = null;
    }

    if (discount_types == 'percentage' && max_reduce == null ) {
      throw new ApiError(StatusCodes.BAD_REQUEST, {
        max_reduce: 'Max reduce is reuiqred with percentage discount type',
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
      max_reduce,
      end_date,
    });

    const populatedVoucher = await Voucher.findById(newVoucher._id).exec();
    return Transformer.transformObjectTypeSnakeToCamel(populatedVoucher.toObject());
  };

  static getAllVouchers = async (req) => {
    const options = getPaginationOptions(req);
    const filter = getFilterOptions(req, ['name', 'status']);

    const paginatedVouchers = await Voucher.paginate(filter, {
      ...options,
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
  static getAllVouchersClient = async (req) => {
    const options = getPaginationOptions(req);
    const filter = getFilterOptions(req, ['name']);

    filter.status = STATUS.ACTIVE;
    filter.max_usage = { $gt: 0 };

    const currentDate = new Date();
    filter.start_date = { $lte: currentDate };
    filter.end_date = { $gte: currentDate };

    const paginatedVouchers = await Voucher.paginate(
      {
        ...filter,
      },
      {
        ...options,
      }
    );

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
    const voucher = await Voucher.findById(req.params.id).exec();

    return Transformer.transformObjectTypeSnakeToCamel(voucher.toObject());
  };

  static updateVoucher = async (req) => {
    const {
      name,
      code,
      max_usage,
      discount,
      discount_types,
      minimum_order_price,
      voucher_type,
      status,
      max_reduce,
      start_date,
      end_date,
    } = req.body;

    const voucherId = req.params.id;

    await checkRecordByField(Voucher, 'name', name, false, voucherId);
    await checkRecordByField(Voucher, 'code', code, false, voucherId);

    let updatedVoucherData = {
      name,
      code,
      max_usage,
      discount,
      discount_types,
      status,
      max_reduce,
      minimum_order_price,
      voucher_type,
      start_date,
      end_date,
    };

    if (discount_types != 'percentage') {
      updatedVoucherData.max_reduce = null;
    }

    const updatedVoucher = await Voucher.findByIdAndUpdate(voucherId, updatedVoucherData, {
      new: true,
    }).exec();

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
