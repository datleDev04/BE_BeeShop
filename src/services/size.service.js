import { StatusCodes } from 'http-status-codes';
import Size from '../models/Size.js';
import ApiError from '../utils/ApiError.js';
import Gender from '../models/Gender.js';
import { Transformer } from '../utils/transformer.js';
import { checkRecordByField } from '../utils/CheckRecord.js';
import { getFilterOptions, getPaginationOptions } from '../utils/pagination.js';
import Product from '../models/Product.js';

export default class SizeService {
  static createNewSize = async (req) => {
    const { name, gender } = req.body;

    await checkRecordByField(Gender, '_id', gender, true);

    const existingSize = await Size.findOne({ name, gender });

    if (existingSize) {
      throw new ApiError(StatusCodes.CONFLICT, {
        name: `Record with size name: ${name}, gender: ${gender} already exists`,
      });
    }

    await Size.create({ name, gender });
    const newSize = await Size.findOne({ name }).populate('gender').exec();
    return Transformer.transformObjectTypeSnakeToCamel(newSize.toObject());
  };

  static getAllSize = async (req) => {
    const options = getPaginationOptions(req);
    const filter = getFilterOptions(req, ['name']);
    options.populate = [{ path: 'gender' }];

    const paginatedSizes = await Size.paginate(filter, options);
    const { docs, ...otherFields } = paginatedSizes;

    const sizesWithProductCount = await Promise.all(
      docs.map(async (size) => {
        const productCount = await Product.countDocuments({
          product_sizes: size._id,
        });

        const sizeObject = size.toObject();
        sizeObject.product_count = productCount;

        return sizeObject;
      })
    );

    // Transform sizes
    const transformedSizes = sizesWithProductCount.map((size) =>
      Transformer.transformObjectTypeSnakeToCamel(size)
    );

    return {
      metaData: Transformer.removeDeletedField(transformedSizes),
      others: otherFields,
    };
  };

  static getOneSize = async (req) => {
    await checkRecordByField(Size, '_id', req.params.id, true);
    const size = await Size.findById(req.params.id).populate('gender').exec();
    return Transformer.transformObjectTypeSnakeToCamel(size.toObject());
  };

  static updateSizeById = async (req) => {
    const { name, gender } = req.body;

    await checkRecordByField(Size, '_id', req.params.id, true);
    await checkRecordByField(Gender, '_id', gender, true);

    const existingSize = await Size.findOne({ name, gender, _id: { $ne: req.params.id } });

    if (existingSize) {
      throw new ApiError(StatusCodes.CONFLICT, {
        name: `Record with size name: ${name}, gender ID: ${gender} already exists`,
      });
    }

    const updatedSize = await Size.findByIdAndUpdate(
      req.params.id,
      { name, gender },
      { new: true }
    );

    const returnData = await Size.findById(updatedSize.id).populate('gender').exec();

    return Transformer.transformObjectTypeSnakeToCamel(returnData.toObject());
  };

  static deleteSizeById = async (req) => {
    await checkRecordByField(Size, '_id', req.params.id, true);
    const productCount = await Product.countDocuments({
      product_sizes: req.params.id,
    });
    if (productCount > 0) {
      throw new ApiError(StatusCodes.CONFLICT, {
        message: 'Không thể xóa kích cỡ này',
      });
    }
    return await Size.findByIdAndDelete(req.params.id);
  };
}
