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
        newPermission
      );
    } catch (error) {
      next(error);
    }
  }
  static getPermission = async (req, res, next) => {
    try {
      const permission = await PermissionService.getPermission(req);

      SuccessResponse(
        res,
        StatusCodes.OK,
        'Get Permission successfully',
        permission
      );
    } catch (error) {
      next(error);
    }
  };
  static getAllPermissions = async (req, res, next) => {
    try {
      const { metaData, others } = await PermissionService.getAllPermissions(req);

      SuccessResponse(
        res,
        StatusCodes.OK,
        'Get All Permission successfully',
        metaData,
        others
      );
    } catch (error) {
      next(error);
    }
  };
  static getAllModule = async (req, res, next) => {
    try {
      const modules = await PermissionService.getAllModule(req);

      SuccessResponse(res, StatusCodes.OK, 'Get All Permission Module successfully', modules);
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
        permissions
      );
    } catch (error) {
      next(error);
    }
  };
  static deletePermission = async (req, res, next) => {
    try {
      await PermissionService.deletePermission(req);

      SuccessResponse(
        res,
        StatusCodes.OK,
        'Delete Permission successfully',
        {}
      );
    } catch (error) {
      next(error);
    }
  };
}
