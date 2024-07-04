import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/ApiError.js';
import jwtUtils from '../utils/jwt.js';
import User from '../models/User.js';
import Black_Tokens from '../models/Black_Tokens.js';

export const authMiddleware = async (req, res, next) => {
  const accessToken = req.get('Authorization')?.split(' ').at(1);

  try {
    // check if accessToken is existed
    if (!accessToken) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Not authorized');

    // check if accesstoke is existed in blacklist
    const blackToken = await Black_Tokens.findOne({ accessToken });
    if (blackToken) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Token is already expired');

    // decode accessToken to get user_id
    const { user_id } = jwtUtils.decodeAccessToken(accessToken);

    //get user info
    const user = await User.findById(user_id).populate({
      path: 'roles',
      populate: { path: 'permissions' } 
    });
    if (!user) throw new ApiError(StatusCodes.UNAUTHORIZED, 'User not found');

    user.password = undefined;

    //get array of permissions 
    const permissionSet = new Set();

    user.roles.forEach(role => {
      // Thêm từng giá trị trong mảng permissions vào Set
      role.permissions.forEach(permission => permissionSet.add(permission.name));
    });

    // return user, accessToken, permissions into request
    req.user = {
      ...user,
      accessToken,
      permissions: Array.from(permissionSet)
    };

    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, new Error(error).message));
  }
};
