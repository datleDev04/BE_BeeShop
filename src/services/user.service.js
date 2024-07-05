import { StatusCodes } from 'http-status-codes';
import Role from '../models/Role.js';
import ApiError from '../utils/ApiError.js';
import User from '../models/User.js';

export default class UserService {
  static updateUser = async (req) => {
    const { roles } = req.body;

    const updatedUser = await User.findByIdAndUpdate(req.params.id, { roles: roles }, { new: true })
      .populate({
        path: 'roles',
        populate: { path: 'permissions' },
      })
      .exec();

    updatedUser.password = undefined;

    if (!updatedUser)
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Server does not response');

    return updatedUser;
  };

  static getOneUser = async (req) => {
    const user = await User.findById(req.params.id)
      .populate([
        {
          path: 'roles',
          populate: { path: 'permissions' },
        },
        {
          path: 'address_list',
        },
      ])
      .exec();

    user.password = undefined;

    return user;
  };

  static getProfileUser = async (req) => {
    console.log(req);

    const user = await User.findOne(req.user._id)
      .populate([
        {
          path: 'roles',
          populate: { path: 'permissions' },
        },
        {
          path: 'address_list',
        },
      ])
      .exec();

    user.password = undefined;

    const userProfile = {
      ...user,
      list_name_permission: req.user.list_name_permission,
      list_name_role: req.user.list_name_role,
    };

    return userProfile;
  };
}
