import { StatusCodes } from 'http-status-codes';
import RoleService from '../services/role.service.js';
import { Transformer } from '../utils/transformer.js';
import { SuccessResponse } from '../utils/response.js';

export class RoleController {
  static getAllRole = async (req, res, next) => {
    try {
      const roles = await RoleService.getAllRole(req);

      const transformedRole = roles.docs.map((role) =>
        Transformer.transformObjectTypeSnakeToCamel(role.toObject())
      );

      const { docs, ...otherFields } = roles;

      const other = {
        ...otherFields,
      };

      SuccessResponse(res, StatusCodes.OK, 'Get All Role successfully', transformedRole, other);
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
        Transformer.transformObjectTypeSnakeToCamel(role.toObject())
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
        Transformer.transformObjectTypeSnakeToCamel(newRole.toObject())
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
        Transformer.transformObjectTypeSnakeToCamel(updatedRole.toObject())
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
