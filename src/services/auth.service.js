import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import bcrypt from 'bcrypt';
import jwtUtils from '../utils/jwt.js';
import User_Token from '../models/User_Token.js';
import { StatusCodes } from 'http-status-codes';
import Black_Tokens from '../models/Black_Tokens.js';
import { STATUS } from '../utils/constants.js';
import { generateVerificationToken } from '../utils/GenerateVerificationToken.js';

import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendVerifiedEmail,
} from '../mail/emails.js';
import { Transformer } from '../utils/transformer.js';
import Address from '../models/Address.js';
import Wishlist from '../models/Wishlist.js';

export class AuthService {
  static register = async (req) => {
    const { full_name, email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      throw new ApiError(StatusCodes.BAD_REQUEST, {
        auth: 'Email này đã được đăng ký!',
      });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const verificationToken = await generateVerificationToken();

    // create a new user
    const newUser = await User.create({
      full_name,
      email,
      password: hashedPassword,
      verification_token: verificationToken,
      verification_token_expires_at: Date.now() + 1 * 60 * 60 * 1000,
    });

    await sendVerificationEmail(email, verificationToken);

    newUser.verification_token = undefined;
    newUser.password = undefined;

    return Transformer.transformObjectTypeSnakeToCamel(newUser.toObject());
  };

  static sendVerifyEmail = async (req) => {
    const { _id } = req.user;

    const user = await User.findById({ _id });

    if (!user) {
      throw new ApiError(StatusCodes.BAD_REQUEST, {
        auth: 'Không tìm thấy người dùng',
      });
    }

    if (user.is_verified) {
      throw new ApiError(StatusCodes.BAD_REQUEST, {
        auth: ' Người dùng này đã được xác minh!',
      });
    }

    const verificationToken = await generateVerificationToken();

    user.verification_token = verificationToken;
    user.verification_token_expires_at = Date.now() + 1 * 60 * 60 * 1000;

    await user.save();

    await sendVerificationEmail(user.email, verificationToken);

    return null;
  };

  static verifyEmail = async (req) => {
    const { code } = req.body;

    const user = await User.findOne({
      verification_token: code,
      verification_token_expires_at: { $gt: Date.now() },
      is_verified: false,
    });

    if (!user) {
      throw new ApiError(StatusCodes.BAD_REQUEST, {
        auth: ' Mã xác minh không hợp lệ',
      });
    }

    user.is_verified = true;
    user.verification_token = undefined;
    user.verification_token_expires_at = undefined;
    await user.save();

    await sendVerifiedEmail(user.email, user.full_name);

    return null;
  };

  static login = async (req) => {
    const { email, password } = req.body;

    // find user by email
    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiError(StatusCodes.BAD_REQUEST, {
        auth: 'Hồ sơ của bạn không được tìm thấy! Đăng ký ngay!',
      });
    }

    if (user.status === STATUS.INACTIVE) {
      throw new ApiError(StatusCodes.BAD_REQUEST, {
        auth: 'Tài khoản của bạn đang không hoạt động, vui lòng liên hệ hỗ trợ!',
      });
    }

    if (user.google_id && !user.password) {
      throw new ApiError(StatusCodes.BAD_REQUEST, {
        auth: 'Tài khoản của bạn phải được đăng nhập bằng nhà cung cấp Google',
      });
    }

    // so sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ApiError(401, {
        auth: 'Email hoặc mật khẩu không chính xác',
      });
    }

    user.password = undefined;

    // create access token
    const accessToken = jwtUtils.createAccessToken(user._id);

    // create refresh token
    const refreshToken = jwtUtils.createRefreshToken();

    await User_Token.findOneAndUpdate(
      { user_id: user._id },
      { refresh_token: refreshToken },
      { upsert: true, new: true }
    );

    return {
      user,
      accessToken,
      refreshToken,
    };
  };

  static loginGoogle = async (req) => {
    if (!req.user) {
      throw new ApiError(401, {
        auth: 'Xác minh thất bại',
      });
    }

    const accessToken = jwtUtils.createAccessToken(req.user._id);

    const refreshToken = jwtUtils.createRefreshToken();

    await User_Token.findOneAndUpdate(
      { user_id: req.user._id },
      { refresh_token: refreshToken },
      { upsert: true, new: true }
    );
    return { user: req.user, accessToken, refreshToken };
  };

  static logout = async (req) => {
    const { accessToken } = req.user;

    const { _id } = req.user;

    await Promise.all([
      Black_Tokens.create({
        user_id: _id,
        access_token: accessToken,
      }),

      User_Token.findOneAndDelete({ user_id: _id }),
    ]);
  };

  static refreshToken = async (req) => {
    try {
      const refreshToken = req.body.refreshToken;

      if (!refreshToken)
        throw new ApiError(StatusCodes.BAD_REQUEST, {
          auth: 'Yêu cầu refresh token',
        });

      // kiểm tra token hợp lệ
      const decodeToken = jwtUtils.decodeRefreshToken(refreshToken);
      if (!decodeToken)
        throw new ApiError(StatusCodes.UNAUTHORIZED, {
          auth: 'Refresh token không hợp lệ',
        });

      const newRefreshToken = jwtUtils.createRefreshToken();

      const tokenInfo = await User_Token.findOneAndUpdate(
        { refresh_token: refreshToken },
        { refresh_token: newRefreshToken },
        { new: true }
      );

      if (!tokenInfo)
        throw new ApiError(StatusCodes.UNAUTHORIZED, {
          auth: 'Refresh token không hợp lệ',
        });

      const access_token = jwtUtils.createAccessToken(tokenInfo.user_id);

      return {
        access_token: access_token,
        refresh_token: newRefreshToken,
      };
    } catch (error) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, error.message);
    }
  };

  static forgotPassword = async (req) => {
    const { email } = req.body;

    if (!email)
      throw new ApiError(StatusCodes.BAD_REQUEST, {
        auth: 'Yêu cầu email',
      });

    const user = await User.findOne({ email });
    if (!user)
      throw new ApiError(StatusCodes.NOT_FOUND, {
        auth: ' Không tìm thấy email nào với user này',
      });

    const token = jwtUtils.createAccessToken(user._id);

    user.reset_password_token = token;

    await user.save();

    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_BASE_URL}/auth/reset-password/${token}`
    );
    return null;
  };

  static resetPassword = async (req) => {
    const { password } = req.body;

    const resetPasswordToken = req.params.token;

    const decode = jwtUtils.decodeAccessToken(resetPasswordToken);

    const user = await User.findOne({ _id: decode.user_id });

    if (!user || user.reset_password_token !== resetPasswordToken)
      throw new ApiError(StatusCodes.UNAUTHORIZED, {
        auth: 'Token không hợp lệ hoặc hết hạn',
      });

    user.password = bcrypt.hashSync(password, 10);
    user.reset_password_token = undefined;

    user.save();

    await sendResetSuccessEmail(user.email);
    return null;
  };

  static getProfileUser = async (req) => {
    const user = await User.findOne(req.user._id)
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
      ])
      .exec();

    const wishlist = await Wishlist.findOne({ user: req.user._id });

    const userPermissions = req.user.roles.flatMap((role) =>
      role.permissions.map((permission) => permission.name)
    );

    if (!userPermissions.includes('Read_User')) {
      user.roles = undefined;
    }

    user.password = undefined;

    const userProfile = {
      ...user.toObject(),
      wishlist: wishlist?.products || [],
      list_name_permission: req.user.list_name_permission,
      list_name_role: req.user.list_name_role,
    };

    return userProfile;
  };

  static updateProfile = async (req) => {
    const {
      full_name,
      password,
      avatar_url,
      phone,
      birth_day,
      gender,
      addresses,
      tags,
      is_new_user,
    } = req.body;

    const userID = req.user._id;

    const currentUser = await User.findById(userID).populate([
      {
        path: 'addresses',
      },
    ]);

    if (!currentUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, {
        not_found: 'User not found',
      });
    }

    let updateAddress = addresses;
    const defaultAddress = addresses?.filter((address) => address.default);
    if (defaultAddress?.length > 1) {
      throw new ApiError(StatusCodes.BAD_REQUEST, {
        addresses: ' Chỉ có một địa chỉ mặc định',
      });
      1;
    } else if (defaultAddress?.length === 0) {
      updateAddress = addresses.map((a, index) => (index === 0 ? { ...a, default: true } : a));
    }

    let newAddressIds;
    if (addresses) {
      const oldAddressIds = currentUser.addresses.map((addr) => addr._id);
      let updateAddress = addresses;
      const defaultAddress = addresses.filter((address) => address.default);
      if (defaultAddress.length > 1) {
        throw new ApiError(StatusCodes.BAD_REQUEST, {
          addresses: ' Chỉ có một địa chỉ mặc định',
        });
      } else if (defaultAddress.length === 0) {
        updateAddress = addresses.map((a, index) => (index === 0 ? { ...a, default: true } : a));
      }
      const createdAddresses = await Address.insertMany(updateAddress);
      await Address.deleteMany({ _id: { $in: oldAddressIds } });
      newAddressIds = createdAddresses.map((addr) => addr._id);
    }

    let updateFields = {
      ...(full_name && { full_name }),
      ...(password && { password: bcrypt.hashSync(password, 10) }),
      ...(avatar_url && { avatar_url }),
      ...(phone && { phone }),
      ...(birth_day && { birth_day }),
      ...(gender && { gender }),
      ...(addresses && { addresses: newAddressIds }),
      ...(tags && { tags }),
      ...(is_new_user && { is_new_user }),
    };

    const updatedUser = await User.findByIdAndUpdate(userID, updateFields, { new: true }).exec();

    if (!updatedUser) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, {
        server: ' Lỗi server',
      });
    }

    const populatedUser = await User.findById(updatedUser._id)
      .populate(['addresses', 'tags'])
      .exec();

    populatedUser.password = undefined;

    return Transformer.transformObjectTypeSnakeToCamel(populatedUser.toObject());
  };
}
