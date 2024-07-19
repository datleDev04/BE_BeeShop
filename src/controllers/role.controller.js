import { StatusCodes } from 'http-status-codes';
import RoleService from '../services/role.service.js';
import { SuccessResponse } from '../utils/response.js';

export class RoleController {
  static getAllRole = async (req, res, next) => {
    try {
      const { metaData, other } = await RoleService.getAllRole(req);

      SuccessResponse(
        res,
        StatusCodes.OK,
        'Get All Role successfully',
        metaData,
        other
      );
    } catch (error) {
      next(error);
    }
  };
  static getOneRole = async (req, res, next) => {
    try {
      const role = await RoleService.getOneRole(req);

      SuccessResponse(
        res,
        StatusCodes.OK,
        'Get One Role successfully',
        role
      );
    } catch (error) {
      next(error);
    }
  };

  static createNewRole = async (req, res, next) => {
    try {
      const newRole = await RoleService.createNewRole(req);

      SuccessResponse(
        res,
        StatusCodes.CREATED,
        'Create New Role successfully',
        newRole
      );
    } catch (error) {
      next(error);
    }
  };

  static updateRoleById = async (req, res, next) => {
    try {
      const updatedRole = await RoleService.updateRoleById(req);

      SuccessResponse(
        res,
        StatusCodes.OK,
        'Updated Role successfully',
        updatedRole
      );
    } catch (error) {
      next(error);
    }
  };

  static deleteRoleById = async (req, res, next) => {
    try {
      await RoleService.deleteRoleById(req);

      SuccessResponse(res, StatusCodes.OK, 'Deleted Role successfully', []);
    } catch (error) {
      next(error);
    }
  };
}
