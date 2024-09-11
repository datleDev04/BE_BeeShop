import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/ApiError.js';
import Address from '../models/Address.js';
import User from '../models/User.js';
import { getFilterOptions, getPaginationOptions } from '../utils/pagination.js';
import { Transformer } from '../utils/transformer.js';
import { checkRecordByField } from '../utils/CheckRecord.js';

export default class AddressService {
  static getAddressesByUserId = async (req) => {
    const { userId } = req.params;
    const addresses = await Address.find({ user_id: userId }).exec();

    return addresses.map((address) =>
      Transformer.transformObjectTypeSnakeToCamel(address.toObject())
    );
  };

  static getAllAddress = async (req) => {
    const options = getPaginationOptions(req);
    const filters = getFilterOptions(req, ['city']);
    let selectPopulate = '-password';

    if (!req.user.list_name_permission.includes('Read_Role')) selectPopulate = '-roles -password';

    const paginatedAddress = await Address.paginate(filters, {
      ...options,
      populate: [{ path: 'user_id', select: selectPopulate }],
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
    let selectPopulate = '-password';

    if (!req.user.list_name_permission.includes('Read_Role')) selectPopulate = '-roles -password';
    const address = await Address.findById(req.params.id)
      .populate('user_id', selectPopulate)
      .exec();
    return Transformer.transformObjectTypeSnakeToCamel(address.toObject());
  };

  static createAddress = async (req) => {
    const { commune = '', district, city, detail_address, default: isDefault } = req.body;

    let populateOptions = '-password';

    if (!req.user.list_name_permission.includes('Read_Role')) populateOptions = '-password -roles';

    await checkRecordByField(User, '_id', req.user._id, true);

    const user = await User.findById(req.user._id);

    if (isDefault) {
      await Address.updateMany({ user_id: user._id, default: true }, { default: false });
    }

    const newAddress = await Address.create({
      commune,
      district,
      city,
      user_id: user.id,
      detail_address,
      default: isDefault,
    });

    user.addresses.push(newAddress._id);
    await user.save();
    const responseData = await Address.findById(newAddress._id)
      .populate('user_id', populateOptions)
      .exec();
    return Transformer.transformObjectTypeSnakeToCamel(responseData.toObject());
  };

  static updateAddress = async (req) => {
    const { commune, district, city, detail_address, default: isDefault } = req.body;
    checkRecordByField(User, '_id', req.user._id, true);

    let selectPopulate = '-password';

    if (!req.user.list_name_permission.includes('Read_Role')) populateOptions = '-password -roles';
    const user = await User.findById(req.user._id);

    if (isDefault) {
      await Address.updateMany({ user_id: user._id, default: true }, { default: false });
    }

    const updatedAddress = await Address.findByIdAndUpdate(
      req.params.id,
      { commune, district, city, user_id: user._id, detail_address, default: isDefault },
      { new: true, runValidators: true }
    );

    if (!updatedAddress) {
      throw new ApiError(StatusCodes.CONFLICT, 'This address is not available');
    }
    const responseData = await Address.findById(req.params.id)
      .populate('user_id', selectPopulate)
      .exec();
    return Transformer.transformObjectTypeSnakeToCamel(responseData.toObject());
  };

  static deleteAddress = async (req) => {
    await checkRecordByField(Address, '_id', req.params.id, true);

    const user = await User.findById(req.user._id);
    if (user) {
      user.addresses.pull(request.params.id);
      await user.save();
    }

    await Address.findByIdAndDelete(req.params.id);
  };
}
