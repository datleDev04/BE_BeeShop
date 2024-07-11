import { StatusCodes } from 'http-status-codes';
import Gender from '../models/Gender.js';
import ApiError from '../utils/ApiError.js';

export default class GenderService {
  static createNewGender = async (req) => {
    const { name } = req.body;

    const existedGender = await Gender.findOne({ name });

    if (existedGender) {
      throw new ApiError(StatusCodes.CONFLICT, 'This gender is existed');
    }

    const newGender = await Gender.create({ name });
    return newGender;
  };

  static getAllGender = async (req) => {
    const genders = await Gender.find().sort({ createdAt: -1 }).exec();
    return genders;
  };

  static getOneGender = async (req) => {
    const gender = await Gender.findById(req.params.id).exec();
    if (!gender) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Gender not found');
    }
    return gender;
  };

  static updateGenderById = async (req) => {
    const { name } = req.body;

    const updatedGender = await Gender.findByIdAndUpdate(
      req.params.id,
      {
        name,
      },
      { new: true }
    );

    if (!updatedGender) {
      throw new ApiError(StatusCodes.CONFLICT, 'This gender is not existing');
    }

    return updatedGender;
  };

  static deleteGenderById = async (req) => {
    const gender = await Gender.findByIdAndDelete(req.params.id);

    if (!gender) {
      throw new ApiError(404, 'Gender not found');
    }
    return gender;
  };
}
