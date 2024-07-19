import { StatusCodes } from 'http-status-codes';
import Brand from '../models/Brand.js';
import ApiError from '../utils/ApiError.js';

export default class BrandService {
  static handleGetAllBrand = async (req) => {
    const brands = await Brand.find().sort({ createdAt: -1 });
    return brands;
  };

  static handleGetOneBrand = async (req) => {
    const brand = await Brand.findById(req.params.id);
    return brand;
  };

  static handleCreateBrand = async (req) => {
    const { name, image, description } = req.body;

    const existedBrand = await Brand.findOne({ name });

    if (existedBrand) {
      throw new ApiError(StatusCodes.CONFLICT, 'This brand is existed');
    }

    const newBrand = await Brand.create({
      name,
      image,
      description,
    });

    return newBrand;
  };

  static handleUpdateBrand = async (req) => {
    const { name, image, description } = req.body;

    const existedBrand = await Brand.findOne({ name });

    if (existedBrand) {
      throw new ApiError(StatusCodes.CONFLICT, 'This brand is existed');
    }

    const updateBrand = await Brand.findByIdAndUpdate(
      req.params.id,
      { name, image, description },
      { new: true, runValidators: true }
    );

    if (!updateBrand) {
      throw new ApiError(StatusCodes.CONFLICT, 'This brand is not available');
    }

    return updateBrand;
  };

  static handleDeleteBrand = async (req) => {
    const { id } = req.params;

    const brand = await Brand.findById(id);

    if (!brand) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Brand not found');
    }
    await Brand.findByIdAndDelete(id);

    return brand;
  };
}
