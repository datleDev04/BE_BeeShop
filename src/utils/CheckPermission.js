import { StatusCodes } from 'http-status-codes';
import ApiError from './ApiError.js';

export function CheckPermission(validPermissions) {
  return function (req, res, next) {
    const permissions = req.user.list_name_permission;

    try {
      const checkPermissions = isArray(validPermissions) ? validPermissions : [validPermissions];

      if (
        permissions.some(
          permission => checkPermissions.includes(permission) || 
          permission === 'All_Permissions'
        )
      ) {
        return next();
      }
      next(new ApiError(StatusCodes.UNAUTHORIZED, "You don't have permission to do this action"));
    } catch (error) {
      next(new ApiError(StatusCodes.UNAUTHORIZED, "You don't have permission to do this action"));
    }
  };
}
