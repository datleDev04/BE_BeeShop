import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import bcrypt from 'bcrypt';
import jwtUtils from '../utils/jwt.js';
import User_Token from '../models/User_Token.js';
import { StatusCodes } from 'http-status-codes';
import Black_Tokens from '../models/Black_Tokens.js';
import { checkRecordByField } from '../utils/CheckRecord.js';

export class AuthService {
  static register = async (req) => {
    const { full_name, email, password, confirm_password } = req.body;

    await checkRecordByField(User, 'email', email, false);

    // check password and confirm_password
    if (password !== confirm_password) {
      throw new ApiError(400, {
        auth: "Passwords don't match",
      });
    }

    // create a new user
    const newUser = await User.create({
      full_name,
      email,
      password: bcrypt.hashSync(password, 10),
    });

    delete newUser.password;

    return newUser;
  };

  static login = async (req) => {
    const { email, password } = req.body;

    await checkRecordByField(User, 'email', email, true);

    // find user by email
    const user = await User.findOne({ email });

    if (user.google_id && !user.password) {
      throw new ApiError(StatusCodes.BAD_REQUEST, {
        auth: 'Your account must be signed in with google provider',
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ApiError(401, {
        auth: 'Email or Password is incorrect',
      });
    }

    user.password = undefined;

    // check status of the user

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
        auth: 'Authentication failed',
      });
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

      if (!refreshToken)
        throw new ApiError(StatusCodes.BAD_REQUEST, {
          auth: 'refresh token is required',
        });

      // check valid token
      const decodeToken = jwtUtils.decodeRefreshToken(refreshToken);
      if (!decodeToken)
        throw new ApiError(StatusCodes.UNAUTHORIZED, {
          auth: 'Invalid refresh token',
        });

      const newRefreshToken = jwtUtils.createRefreshToken();

      const tokenInfo = await User_Token.findOneAndUpdate(
        { refresh_token: refreshToken },
        { refresh_token: newRefreshToken },
        { new: true }
      );

      if (!tokenInfo)
        throw new ApiError(StatusCodes.UNAUTHORIZED, {
          auth: 'Invalid refresh token',
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

  // static forgotPassword = async (reqBody) => {
  //     const { email } = reqBody

  //     if (!email) throw new ApiError(StatusCodes.BAD_REQUEST, "email is required")

  //     const user = await User.findOne({ email })
  //     if (!user) throw new ApiError(StatusCodes.NOT_FOUND, "User not found")

  //     user.resetPassword_Token = jwtUtils.createAccessToken(user._id)

  //     user.save()

  //     sendEmail(
  //         user.email,
  //         "Reset Your Instagram Account Password",
  //         mailForgotPassword(
  //             `${process.env.CLIENT_BASE_URL}/auth/reset-password/${user.resetPassword_Token}`
  //         )
  //     )
  // }

  // static resetPassword = async ( req ) => {
  //     const { password, confirm_password } = req.body

  //     const resetPassword_Token = req.params.token

  //     const decode = jwtUtils.decodeToken(resetPassword_Token)

  //     const user = await User.findOne({ _id: decode.user_id })
  //     if (!user) throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid or Token expired")

  //     if (password !== confirm_password) {
  //         throw new ApiError(StatusCodes.BAD_REQUEST, "Passwords don't match")
  //     }

  //     user.password = bcrypt.hashSync(password, 10)
  //     user.resetPassword_Token = null

  //     user.save()
  // }

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
