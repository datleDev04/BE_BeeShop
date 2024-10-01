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

export class AuthService {
  static register = async (req) => {
    const { full_name, email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Email has been taken!');
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const verificationToken = await generateVerificationToken();

    // create a new user
    const newUser = await User.create({
      full_name,
      email,
      password: hashedPassword,
      verificationToken: verificationToken,
      verificationTokenExpiresAt: Date.now() + 1 * 60 * 60 * 1000,
    });

    await sendVerificationEmail(email, verificationToken);

    return newUser;
  };

  static sendVerifyEmail = async (req) => {
    const { _id } = req.user;

    const user = await User.findById({ _id });

    if (!user) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'User not found');
    }

    if (user.is_verified) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'This user has been verified!');
    }

    const verificationToken = await generateVerificationToken();

    user.verificationToken = verificationToken;
    user.verificationTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

    await user.save();

    await sendVerificationEmail(user.email, verificationToken);

    return null;
  };

  static verifyEmail = async (req) => {
    const { code } = req.body;

    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'User not found or verification token is invalid'
      );
    }

    user.is_verified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendVerifiedEmail(user.email, user.full_name);

    return null;
  };

  static login = async (req) => {
    const { email, password } = req.body;

    // find user by email
    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Your profile could not found! Register now!');
    }

    if (user.status === STATUS.INACTIVE) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Your account is inactive, please contact support!'
      );
    }

    if (user.google_id && !user.password) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Your account must be signed in with google provider'
      );
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid credentials!');
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
      throw new ApiError(401, 'Authentication failed');
    }

    const accessToken = jwtUtils.createAccessToken(req.user._id);

    const refreshToken = jwtUtils.createRefreshToken();

    await User_Token.findOneAndUpdate(
      { user_id: req.user._id },
      { refresh_token: refreshToken },
      { upsert: true, new: true }
    );
    return { accessToken, refreshToken };
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

      if (!refreshToken) throw new ApiError(StatusCodes.BAD_REQUEST, 'refresh token is required');

      // check valid token
      const decodeToken = jwtUtils.decodeRefreshToken(refreshToken);
      if (!decodeToken) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid refresh token');

      const newRefreshToken = jwtUtils.createRefreshToken();

      const tokenInfo = await User_Token.findOneAndUpdate(
        { refresh_token: refreshToken },
        { refresh_token: newRefreshToken },
        { new: true }
      );

      if (!tokenInfo) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid refresh token');

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

    if (!email) throw new ApiError(StatusCodes.BAD_REQUEST, 'Email is required');

    const user = await User.findOne({ email });
    if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'No user exists for this email');

    const token = jwtUtils.createAccessToken(user._id);

    user.resetPasswordToken = token;

    await user.save();

    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_BASE_URL}/auth/reset-password/${token}`
    );
    return null;
  };

  static resetPassword = async (req) => {
    const { password } = req.body;

    const resetPassword_Token = req.params.token;

    const decode = jwtUtils.decodeAccessToken(resetPassword_Token);

    const user = await User.findOne({ _id: decode.user_id });

    if (!user || user.resetPasswordToken !== resetPassword_Token)
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid or Token expired');

    user.password = bcrypt.hashSync(password, 10);
    user.resetPasswordToken = undefined;

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

    const userPermissions = req.user.roles.flatMap((role) =>
      role.permissions.map((permission) => permission.name)
    );

    if (!userPermissions.includes('Read_User')) {
      user.roles = undefined;
    }

    user.password = undefined;

    const userProfile = {
      ...user.toObject(),
      list_name_permission: req.user.list_name_permission,
      list_name_role: req.user.list_name_role,
    };

    return userProfile;
  };
}
