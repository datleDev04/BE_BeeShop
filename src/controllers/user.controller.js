import { StatusCodes } from 'http-status-codes';
import UserService from '../services/user.service.js';
import { Transformer } from '../utils/transformer.js';
import { SuccessResponse } from '../utils/response.js';
import User from '../models/User.js';

export class UserController {
  static updateUser = async (req, res, next) => {
    try {
      const updatedUser = await UserService.updateUser(req);

      SuccessResponse(
        res,
        StatusCodes.OK,
        'Updated User successfully',
        Transformer.transformObjectTypeSnakeToCamel(updatedUser.toObject())
      );
    } catch (error) {
      next(error);
    }
  };

  static getOneUser = async (req, res, next) => {
    try {
      const user = await UserService.getOneUser(req);

      SuccessResponse(
        res,
        StatusCodes.OK,
        'Get One User successfully',
        Transformer.transformObjectTypeSnakeToCamel(user.toObject())
      );
    } catch (error) {
      next(error);
    }
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
      ...user.toObject(),
      list_name_permission: req.user.list_name_permission,
      list_name_role: req.user.list_name_role,
    };

    return userProfile;
  };
}
