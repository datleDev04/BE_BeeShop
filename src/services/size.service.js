import { StatusCodes } from 'http-status-codes';
import Size from '../models/Size.js';
import ApiError from '../utils/ApiError.js';
import Gender from '../models/Gender.js';
import { Transformer } from '../utils/transformer.js';
import { checkRecordByField } from '../utils/CheckRecord.js';

export default class SizeService {
  static createNewSize = async (req) => {
    const { name, gender } = req.body;

    const existingSize = await Size.findOne({ name, gender });

    if (existingSize) {
      throw new ApiError(StatusCodes.CONFLICT, 'Size already exists ');
    }

    await Size.create({ name, gender });
    const newSize = await Size.findOne({ name }).populate('gender').exec();
    return Transformer.transformObjectTypeSnakeToCamel(newSize.toObject());
  };

  static getAllSize = async (req) => {
    const sizes = await Size.find().populate('gender').sort({ createdAt: -1 }).exec();
    const returnData = sizes.map((size) => {
      return Transformer.transformObjectTypeSnakeToCamel(size.toObject());
    });
    return returnData;
  };

  static getOneSize = async (req) => {
    await checkRecordByField(Size, '_id', req.params.id, true);
    const size = await Size.findById(req.params.id).populate('gender').exec();
    return Transformer.transformObjectTypeSnakeToCamel(size.toObject());
  };

  static updateSizeById = async (req) => {
    const { name, gender } = req.body;

    await checkRecordByField(Size, '_id', req.params.id, true);

    const existingSize = await Size.findOne({ name, gender, _id: { $ne: req.params.id } });

    if (existingSize) {
      throw new ApiError(StatusCodes.CONFLICT, 'Size already exists ');
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
    return await Size.findByIdAndDelete(req.params.id);
  };
}
