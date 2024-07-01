import { StatusCodes } from 'http-status-codes';
import Role from '../models/Role.js';
import ApiError from '../utils/ApiError.js';

export default class RoleService {
  static createNewRole = async (req) => {
    const { name, permissions } = req.body;

    const existedRole = await Role.findOne({ name });

    if (existedRole) {
      throw new ApiError(StatusCodes.CONFLICT, 'This role is existed');
    }

    await Role.create({ name, permissions });

    return Role.findOne({ name }).populate('permissions').exec();
  };

  static getAllRole = async (req) => {
    const roles = await Role.find().populate('permissions').exec();
    return roles;
  };

  static getOneRole = async (req) => {
    const roles = await Role.findById(req.params.id).populate('permissions').exec();
    return roles;
  };

  static updateRoleById = async (req) => {
    const { name, permissions } = req.body;

    const updatedRole = await Role.findByIdAndUpdate(req.params.id, { name, permissions });

    if (!updatedRole) {
      throw new ApiError(StatusCodes.CONFLICT, 'This role is not existing');
    }

    return Role.findById(req.params.id).populate('permissions').exec();
  };

  static deleteRoleById = async (req) => {
    await Role.findByIdAndDelete(req.params.id);
  };
}
