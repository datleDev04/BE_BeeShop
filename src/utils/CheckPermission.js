import { StatusCodes } from 'http-status-codes';
import ApiError from './ApiError.js';

export function CheckPermission(validPermission) {
  return function (req, res, next) {
    const permissions = req.user.list_name_permission;

    try {
      for (const permission of permissions) {
        if (permission === validPermission || permission === 'All_Permissions') {
          return next();
        }
      }
      next(new ApiError(StatusCodes.UNAUTHORIZED, "You don't have permission to do this action"));
    } catch (error) {
      next(new ApiError(StatusCodes.UNAUTHORIZED, "You don't have permission to do this action"));
    }
  };
}
