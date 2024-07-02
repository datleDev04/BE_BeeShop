import { StatusCodes } from 'http-status-codes';
import PermissionService from '../services/permission.service.js';
import { Transformer } from '../utils/transformer.js';
import { SuccessResponse } from '../utils/response.js';

export class PermissionController {
  static createNewPermission = async (req, res, next) => {
    try {
      const newPermission = await PermissionService.createNewPermission(req);

      SuccessResponse(
        res,
        StatusCodes.CREATED,
        'Create New Permission successfully',
        Transformer.transformObjectTypeSnakeToCamel(newPermission.toObject())
      );
    } catch (error) {
      next(error);
    }
  };
  static getPermission = async (req, res, next) => {
    try {
      const permission = await PermissionService.getPermission(req);

      SuccessResponse(
        res,
        StatusCodes.OK,
        'Get Permission successfully',
        Transformer.transformObjectTypeSnakeToCamel(permission.toObject())
      );
    } catch (error) {
      next(error);
    }
  };
  static getAllPermissions = async (req, res, next) => {
    try {
      const permissions = await PermissionService.getAllPermissions(req);

      const returnData = permissions.map((permission) => {
        return Transformer.transformObjectTypeSnakeToCamel(permission.toObject());
      });

      SuccessResponse(res, StatusCodes.OK, 'Get All Permission successfully', returnData);
    } catch (error) {
      next(error);
    }
  };

  static updatePermission = async (req, res, next) => {
    try {
      const permissions = await PermissionService.updatePermission(req);

      SuccessResponse(
        res,
        StatusCodes.OK,
        'Updated Permission successfully',
        Transformer.transformObjectTypeSnakeToCamel(permissions.toObject())
      );
    } catch (error) {
      next(error);
    }
  };
  static deletePermission = async (req, res, next) => {
    try {
      const deletedPermission = await PermissionService.deletePermission(req);

      SuccessResponse(
        res,
        StatusCodes.OK,
        'Delete Permission successfully',
        Transformer.transformObjectTypeSnakeToCamel(deletedPermission.toObject())
      );
    } catch (error) {
      next(error);
    }
  };
}
