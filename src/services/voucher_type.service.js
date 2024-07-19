import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/ApiError.js';
import VoucherType from '../models/Voucher_Type.js';
import { getFilterOptions, getPaginationOptions } from '../utils/pagination.js';
import { Transformer } from '../utils/transformer.js';
import { checkRecordByField } from '../utils/CheckRecord.js';

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
    const options = getPaginationOptions(req);
    const filter = getFilterOptions(req, ['name']);

    const paginatedVoucherTypes = await VoucherType.paginate(filter, options);

    const { docs, ...otherFields } = paginatedVoucherTypes;

    const transformedVoucherTypes = docs.map((voucherType) =>
      Transformer.transformObjectTypeSnakeToCamel(voucherType.toObject())
    );

    const others = {
      ...otherFields,
    };

    return {
      metaData: Transformer.removeDeletedField(transformedVoucherTypes),
      others,
    };
  };

  static getOneVoucherType = async (req) => {
    await checkRecordByField(VoucherType, '_id', req.params.id, true);
    const voucherType = await VoucherType.findById(req.params.id);

    return Transformer.transformObjectTypeSnakeToCamel(voucherType.toObject());
  };

  static updateVoucherType = async (req) => {
    const { name } = req.body;

    const existedVoucherType = await VoucherType.findOne({ name });

    if (existedVoucherType) {
      throw new ApiError(StatusCodes.CONFLICT, 'This voucher type is existed');
    }

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
