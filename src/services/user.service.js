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
      full_name,
      avatar_url,
      phone,
      status,
      gender,
      roles,
      addresses,
      tags,
    } = req.body;

    const userPermissions = req.user.roles.flatMap((role) =>
      role.permissions.map((permission) => permission.name)
    );

    if (!userPermissions.includes('Read_User') && roles) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, {
        not_have_access: 'You do not have permission to create users with roles',
      });
    }

    await checkRecordByField(User, 'user_name', user_name, false);
    await checkRecordByField(User, 'email', email, false);

    const newUser = await User.create({
      user_name,
      email,
      password: bcrypt.hashSync(password, 10),
      full_name,
      avatar_url,
      phone,
      status,
      gender,
      roles,
      addresses,
      tags,
    });

    const populatedUser = await User.findById(newUser._id)
      .populate([
        {
          path: 'roles',
          populate: { path: 'permissions' },
        },
        {
          path: 'gender',
        },
        {
          path: 'addresses',
        },
        {
          path: 'tags',
        },
      ])
      .exec();

    populatedUser.password = undefined;

    return Transformer.transformObjectTypeSnakeToCamel(populatedUser.toObject());
  };

  static updateUser = async (req) => {
    const {
      user_name,
      email,
      password,
      avatar_url,
      full_name,
      phone,
      birth_day,
      status,
      gender,
      roles,
      addresses,
      tags,
    } = req.body;
    await checkRecordByField(User, 'user_name', user_name, false, req.user._id);
    await checkRecordByField(User, 'email', email, false, req.user._id);

    const userPermissions = req.user.roles.flatMap((role) =>
      role.permissions.map((permission) => permission.name)
    );

    if (!userPermissions.includes('Read_User') && req.body.roles) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, {
        not_have_access: 'You do not have permission to update roles',
      });
    }
    const currentUser = await User.findById(req.params.id).populate({
      path: 'roles',
    });

    if (!currentUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, {
        not_found: 'User not found',
      });
    }

    const isCustomer = currentUser.roles.some((role) => role.name === 'Customer');

    let updateFields = {
      ...(user_name && { user_name }),
      ...(password && { password: bcrypt.hashSync(password, 10) }),
      ...(avatar_url && { avatar_url }),
      ...(email && { email }),
      ...(full_name && { full_name }),
      ...(phone && { phone }),
      ...(birth_day && { birth_day }),
      ...(gender && { gender }),
      ...(status && { status }),
      ...(addresses && { addresses }),
      ...(tags && { tags }),
    };

    const restrictedFields = [
      'user_name',
      'password',
      'avatar_url',
      'email',
      'full_name',
      'phone',
      'birth_day',
      'gender',
      'addresses',
      'tags',
    ];

    if (isCustomer) {
      //check fields
      if (Object.keys(updateFields).some((field) => restrictedFields.includes(field))) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, {
          not_have_access: 'You only have permission to update status!',
        });
      }
      updateFields = {
        ...((status || status == 0) && { status }),
      };
      console.log(updateFields, status);
    } else {
      if (userPermissions.includes('Read_User')) {
        updateFields = { ...updateFields, ...(roles && { roles }) };
      }
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateFields, { new: true })
      .populate([
        {
          path: 'roles',
          populate: { path: 'permissions' },
        },
        {
          path: 'addresses',
        },
        {
          path: 'gender',
        },
        {
          path: 'tags',
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
    const user = await User.findById(req.params.id)
      .populate([
        {
          path: 'roles',
          populate: { path: 'permissions' },
        },
        {
          path: 'addresses',
        },
        {
          path: 'gender',
        },
        {
          path: 'vouchers',
        },
        {
          path: 'tags',
        },
      ])
      .exec();

    user.password = undefined;

    return Transformer.transformObjectTypeSnakeToCamel(user.toObject());
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
        path: 'gender',
      },
      {
        path: 'vouchers',
      },
      {
        path: 'tags',
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

  static deleteUser = async (req) => {
    await checkRecordByField(User, '_id', req.params.id, true);

    const user = await User.findById(req.params.id).populate({
      path: 'roles',
    });

    const isCustomer = user.roles.some((role) => role.name === 'Customer');
    if (isCustomer)
      throw new ApiError(StatusCodes.UNAUTHORIZED, {
        not_have_access: 'You only have permission to delete customer!',
      });

    const res = await User.findByIdAndDelete(req.params.id);

    return Transformer.transformObjectTypeSnakeToCamel(res.toObject());
  };
}
