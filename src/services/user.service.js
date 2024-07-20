import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/ApiError.js';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import { getFilterOptions, getPaginationOptions } from '../utils/pagination.js';
import { Transformer } from '../utils/transformer.js';
import { checkRecordByField } from '../utils/CheckRecord.js';

export default class UserService {
  static createUser = async (req) => {
    const {
      user_name,
      email,
      password,
      avatar_url,
      phone,
      birth_day,
      status,
      sex,
      roles,
      address_list,
      vouchers,
      tag_list,
    } = req.body;

    const userPermissions = req.user.roles.flatMap((role) =>
      role.permissions.map((permission) => permission.name)
    );

    if (!userPermissions.includes('Read_User') && roles) {
      throw new ApiError(StatusCodes.FORBIDDEN, {
        not_have_access: 'You do not have permission to create users with roles',
      });
    }

    await checkRecordByField(User, 'user_name', user_name, false);
    await checkRecordByField(User, 'email', email, false);

    const newUser = await User.create({
      user_name,
      email,
      password: bcrypt.hashSync(password, 10),
      avatar_url,
      phone,
      birth_day,
      status,
      sex,
      roles,
      address_list,
      vouchers,
      tag_list,
    });

    const populatedUser = await User.findById(newUser._id)
      .populate([
        {
          path: 'roles',
          populate: { path: 'permissions' },
        },
        {
          path: 'address_list',
        },
        {
          path: 'vouchers',
        },
        {
          path: 'tag_list',
        },
      ])
      .exec();

    populatedUser.password = undefined;

    return Transformer.transformObjectTypeSnakeToCamel(populatedUser.toObject());
  };
  static updateUser = async (req) => {
    const {
      user_name,
      password,
      avatar_url,
      email,
      phone,
      birth_day,
      status,
      sex,
      roles,
      address_list,
      vouchers,
      tag_list,
    } = req.body;

    await checkRecordByField(User, 'user_name', user_name, false, req.user._id);
    await checkRecordByField(User, 'email', email, false, req.user._id);

    let updateFields = {
      ...(user_name && { user_name }),
      ...(password && { password: bcrypt.hashSync(password, 10) }),
      ...(avatar_url && { avatar_url }),
      ...(email && { email }),
      ...(phone && { phone }),
      ...(birth_day && { birth_day }),
      ...(sex && { sex }),
      ...(status && { status }),
      ...(address_list && { address_list }),
      ...(vouchers && { vouchers }),
      ...(tag_list && { tag_list }),
    };

    const userPermissions = req.user.roles.flatMap((role) =>
      role.permissions.map((permission) => permission.name)
    );

    if (!userPermissions.includes('Read_User') && req.body.roles) {
      throw new ApiError(StatusCodes.FORBIDDEN, {
        not_have_access: 'You do not have permission to update roles',
      });
    }

    if (userPermissions.includes('Read_User')) {
      updateFields = { ...updateFields, ...(roles && { roles }) };
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updateFields, { new: true })
      .populate([
        {
          path: 'roles',
          populate: { path: 'permissions' },
        },
        {
          path: 'address_list',
        },
        {
          path: 'vouchers',
        },
        {
          path: 'tag_list',
        },
      ])
      .exec();

    if (!updatedUser) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, {
        server: 'Server does not respond',
      });
    }

    updatedUser.password = undefined;

    return Transformer.transformObjectTypeSnakeToCamel(updatedUser.toObject());
  };

  static getOneUser = async (req) => {
    await checkRecordByField(User, '_id', req.params.id, true);
    const user = await User.findById(req.user._id)
      .populate([
        {
          path: 'roles',
          populate: { path: 'permissions' },
        },
        {
          path: 'address_list',
        },
        {
          path: 'vouchers',
        },
        {
          path: 'tag_list',
        },
      ])
      .exec();

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
      {
        path: 'vouchers',
      },
      {
        path: 'tag_list',
      },
    ]);

    const metaData = users.docs.map((user) => {
      const userObj = user.toObject();
      delete userObj.password;
      return Transformer.transformObjectTypeSnakeToCamel(userObj);
    });

    const { docs, ...otherFields } = users;

    return {
      metaData,
      ...otherFields,
    };
  };
}
