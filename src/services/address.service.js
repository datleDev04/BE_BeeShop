import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/ApiError.js';
import Address from '../models/Address.js';

export default class AddressService {
  static handleCreateAddress = async (req) => {
    const { commune, district, city, user_id, detail_address } = req.body;

    const newAddress = await Address.create({ commune, district, city, user_id, detail_address });

    return Address.findById(newAddress._id).populate('user_id').exec();
  };

  static handleGetAllAddress = async (req) => {
    const address = await Address.find().populate('user_id').exec();
    return address;
  };

  static handleGetOneAddress = async (req) => {
    const address = await Address.findById(req.params.id).populate('user_id').exec();
    return address;
  };

  static handleUpdateAddress = async (req) => {
    const { commune, district, city, user_id, detail_address } = req.body;

    const updatedAddress = await Address.findByIdAndUpdate(
      req.params.id,
      { commune, district, city, user_id, detail_address },
      { new: true, runValidators: true }
    );

    if (!updatedAddress) {
      throw new ApiError(StatusCodes.CONFLICT, 'This address is not available');
    }

    return Address.findById(req.params.id).populate('user_id').exec();
  };

  static handleDeleteAddress = async (req) => {
    const address = await Address.findById(req.params.id);

    if (!address) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Address not found');
    }

    await Address.findByIdAndDelete(req.params.id);

    return address;
  };
}
