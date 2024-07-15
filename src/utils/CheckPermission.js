import { StatusCodes } from 'http-status-codes';
import ApiError from './ApiError.js';

export function CheckPermission(validPermissions) {
  return function (req, res, next) {
    const permissions = req.user.list_name_permission;

    const checkPermissions = Array.isArray(validPermissions) ? validPermissions : [validPermissions];

    if (
      permissions.some(
        permission => checkPermissions.includes(permission) || 
        permission === 'All_Permissions'
      )
    ) {
      return next();
    }

    next(new ApiError(StatusCodes.FORBIDDEN, "You don't have permission to do this action"));
  };
}
