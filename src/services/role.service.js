import { StatusCodes } from 'http-status-codes';
import Role from '../models/Role.js';
import ApiError from '../utils/ApiError.js';
import { paginate } from 'mongoose-paginate-v2';

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
    let {
      _page = 1,
      _limit = 10,
      _order = 'asc',
      _sort = 'createAt',
      _pagination = true,
    } = req.query;

      let options = {
        page: _page,
        limit: _limit,
        sort: {
          [_sort]: _order === 'desc' ? 1 : -1,
        },
        populate: 'permissions',
      };

    if (_pagination != true) {
      options = {
        pagination: false
      }
    }

    const name = req.body.name;
    let filter = {};
    if (name) {
      filter = { name: { $regex: `.*${name}.*`, $options: 'i' } };
    }

    const roles = Role.paginate(filter, options)

    return roles;
  };

  static getOneRole = async (req) => {
    const roles = await Role.findById(req.params.id).populate('permissions').exec();
    return roles;
  };

  static updateRoleById = async (req) => {
    const { name, permissions, action } = req.body;
    const update = { name };

    const currentRole = await Role.findById(req.params.id).populate('permissions');

    if (!currentRole) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Role not found!');
    }

    const permissionsIds = currentRole.permissions.map((per) => per.id);

    if (action === 'delete_permission') {
      update.$pull = { permissions: { $in: permissions } };
    } else if (action === 'add_permission') {
      const newPermissions = permissions.filter((p) => !permissionsIds.includes(p));
      update.$push = { permissions: { $each: newPermissions } };
    }

    await Role.findByIdAndUpdate(req.params.id, update);

    return Role.findById(req.params.id).populate('permissions').exec();
  };

  static deleteRoleById = async (req) => {
    await Role.findByIdAndDelete(req.params.id);
  };
}
