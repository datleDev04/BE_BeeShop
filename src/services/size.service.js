import { StatusCodes } from 'http-status-codes';
import Size from '../models/Size.js';
import ApiError from '../utils/ApiError.js';
import Gender from '../models/Gender.js';

export default class SizeService {
  static createNewSize = async (req) => {
    const { name, gender } = req.body;

    const existedGender = await Gender.findById(gender);

    if (!existedGender) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Gender not found');
    }

    const existedName = await Size.findOne({
      name,
      gender,
    });

    if (existedName) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Size name is existed!');
    }

    await Size.create({ name, gender });
    return Size.findOne({ name }).populate('gender').exec();
  };

  static getAllSize = async (req) => {
    const sizes = await Size.find().populate('gender').sort({ createdAt: -1 }).exec();
    return sizes;
  };

  static getOneSize = async (req) => {
    const size = await Size.findById(req.params.id).populate('gender').exec();
    if (!size) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Size not found');
    }
    return size;
  };

  static updateSizeById = async (req) => {
    const { name, gender } = req.body;
    const updateFields = {};

    if (name) {
      updateFields.name = name;
    }

    if (gender) {
      const existedGender = await Gender.findById(gender);

      if (!existedGender) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Gender not found');
      }

      updateFields.gender = gender;
    }

    const updatedSize = await Size.findByIdAndUpdate(req.params.id, updateFields, { new: true });

    if (!updatedSize) {
      throw new ApiError(StatusCodes.CONFLICT, 'This size is not existing');
    }

    return Size.findById(updatedSize.id).populate('gender').exec();
  };

  static deleteSizeById = async (req) => {
    const size = await Size.findByIdAndDelete(req.params.id);

    if (!size) {
      throw new ApiError(404, 'Size not found');
    }
    return size;
  };
}
