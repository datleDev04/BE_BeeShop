import { StatusCodes } from 'http-status-codes';
import Color from '../models/Color.js';
import ApiError from '../utils/ApiError.js';

export default class ColorService {
  static createNewColor = async (req) => {
    const { name } = req.body;

    const existedColor = await Color.findOne({ name });

    if (existedColor) {
      throw new ApiError(StatusCodes.CONFLICT, 'This color is existed');
    }

    const newColor = await Color.create({ name });
    return newColor;
  };

  static getAllColor = async (req) => {
    const colors = await Color.find().exec();
    return colors;
  };

  static getOneColor = async (req) => {
    const color = await Color.findById(req.params.id).exec();
    if (!color) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Color not found');
    }
    return color;
  };

  static updateColorById = async (req) => {
    const { name } = req.body;

    const updatedColor = await Color.findByIdAndUpdate(
      req.params.id,
      {
        name,
      },
      { new: true }
    );

    if (!updatedColor) {
      throw new ApiError(StatusCodes.CONFLICT, 'This color is not existing');
    }

    return updatedColor;
  };

  static deleteColorById = async (req) => {
    const color = await Color.findByIdAndDelete(req.params.id);

    if (!color) {
      throw new ApiError(404, 'Color not found');
    }
    return color;
  };
}
