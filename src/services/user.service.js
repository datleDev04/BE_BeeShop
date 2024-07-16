import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/ApiError.js';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import { getFilterOptions, getPaginationOptions } from '../utils/pagination.js';

export default class UserService {
  static updateUser = async (req) => {
    const { user_name, password, avatar_url, email, roles, address_list } = req.body;

    let updateFields = {
      ...(user_name && { user_name }),
      ...(password && { password: bcrypt.hashSync(password, 10) }),
      ...(avatar_url && { avatar_url }),
      ...(email && { email }),
      ...(address_list && { address_list }),
    };

    const userPermissions = req.user.roles.flatMap((role) =>
      role.permissions.map((permission) => permission.name)
    );

    if (!userPermissions.includes('Read_User') && req.body.roles) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'You do not have permission to update roles');
    }

    if (userPermissions.includes('Read_User')) {
      updateFields = { ...updateFields, ...(roles && { roles }) };
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateFields, { new: true })
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

    if (!updatedUser) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Server does not respond');
    }

    updatedUser.password = undefined;

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

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
    }

    const userPermissions = req.user.roles.flatMap((role) =>
      role.permissions.map((permission) => permission.name)
    );

    if (!userPermissions.includes('Read_User')) {
      user.roles = undefined;
    }

    user.password = undefined;

    return user;
  };

  static getAllUsers = async (req) => {
    const options = getPaginationOptions(req);
    const filter = getFilterOptions(req, ['user_name', 'email']);

    const users = await User.paginate(filter, options);

    await User.populate(users.docs, [
      {
        path: 'roles',
        populate: { path: 'permissions' },
      },
      {
        path: 'address_list',
      },
    ]);

    return users;
  };
}
