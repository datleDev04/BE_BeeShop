import { StatusCodes } from 'http-status-codes';
import Role from '../models/Role.js';
import ApiError from '../utils/ApiError.js';
import { getFilterOptions, getPaginationOptions } from '../utils/pagination.js';

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
    const options = getPaginationOptions(req);
    const filter = getFilterOptions(req, ['name']);

    const roles = await Role.paginate(filter, options);

    await Role.populate(roles.docs, { path: 'permissions' });

    return roles;
  };

  static getOneRole = async (req) => {
    const roles = await Role.findById(req.params.id).populate('permissions').exec();
    return roles;
  };

  static updateRoleById = async (req) => {
    const { name, permissions } = req.body;

    const updatedRole = await Role.findByIdAndUpdate(
      req.params.id,
      { name, permissions },
      { new: true })
      .populate('permissions').exec();
    return updatedRole
  };

  static deleteRoleById = async (req) => {
    await Role.findByIdAndDelete(req.params.id);
  };
}
