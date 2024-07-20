import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/ApiError.js';
import Address from '../models/Address.js';
import User from '../models/User.js';
import { getFilterOptions, getPaginationOptions } from '../utils/pagination.js';
import { Transformer } from '../utils/transformer.js';
import { checkRecordByField } from '../utils/CheckRecord.js';

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
      user_id: user.id,
      detail_address,
    });

    user.address_list.push(newAddress._id);
    await user.save();
    const responseData = await Address.findById(newAddress._id).populate('user_id').exec();
    return Transformer.transformObjectTypeSnakeToCamel(responseData.toObject());
  };

  static getAllAddress = async (req) => {
    const options = getPaginationOptions(req);
    const filters = getFilterOptions(req, ['city']);

    const paginatedAddress = await Address.paginate(filters, {
      ...options,
      populate: [{ path: 'user_id' }],
    });
    const { docs, ...otherFields } = paginatedAddress;
    const transformedAddress = docs.map((label) =>
      Transformer.transformObjectTypeSnakeToCamel(label.toObject())
    );

    const others = {
      ...otherFields,
    };

    return {
      metaData: Transformer.removeDeletedField(transformedAddress),
      others,
    };
  };

  static getOneAddress = async (req) => {
    const address = await Address.findById(req.params.id).populate('user_id').exec();
    return Transformer.transformObjectTypeSnakeToCamel(address.toObject());
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
    const responseData = await Address.findById(req.params.id).populate('user_id').exec();
    return Transformer.transformObjectTypeSnakeToCamel(responseData.toObject);
  };

  static deleteAddress = async (req) => {
    await checkRecordByField(Address, '_id', req.params.id, true);

    const user = await User.findById(req.user._id);
    if (user) {
      user.address_list.pull(address._id);
      await user.save();
    }

    await Address.findByIdAndDelete(req.params.id);
  };
}
