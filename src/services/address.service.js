import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/ApiError.js';
import Address from '../models/Address.js';
import User from '../models/User.js';

export default class AddressService {
  static createAddress = async (req) => {
    const { commune, district, city, detail_address } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'User not found');
    }

    const newAddress = await Address.create({
      commune,
      district,
      city,
      user_id: user._id,
      detail_address,
    });

    user.address_list.push(newAddress._id);
    await user.save();

    return Address.findById(newAddress._id).populate('user_id').exec();
  };

  static getAllAddress = async (req) => {
    const address = await Address.find().populate('user_id').sort({ createdAt: -1 }).exec();
    return address;
  };

  static getOneAddress = async (req) => {
    const address = await Address.findById(req.params.id).populate('user_id').exec();
    return address;
  };

  static updateAddress = async (req) => {
    const { commune, district, city, detail_address } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'User not found');
    }

    const updatedAddress = await Address.findByIdAndUpdate(
      req.params.id,
      { commune, district, city, user_id: user._id, detail_address },
      { new: true, runValidators: true }
    );

    if (!updatedAddress) {
      throw new ApiError(StatusCodes.CONFLICT, 'This address is not available');
    }

    return Address.findById(req.params.id).populate('user_id').exec();
  };

  static deleteAddress = async (req) => {
    const address = await Address.findById(req.params.id);

    if (!address) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Address not found');
    }

    const user = await User.findById(req.user._id);
    if (user) {
      user.address_list.pull(address._id);
      await user.save();
    }

    await Address.findByIdAndDelete(req.params.id);

    return address;
  };
}
