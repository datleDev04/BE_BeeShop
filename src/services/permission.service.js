import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import Permission from '../models/Permission.js';
import Role from '../models/Role.js';
import ApiError from '../utils/ApiError.js';
import { getFilterOptions, getPaginationOptions } from '../utils/pagination.js';

export default class PermissionService {
  static createNewPermission = async (req) => {
    const { name, label, module } = req.body;

    // check existed permissions
    const existedPermission = await Permission.findOne({ name });
    if (existedPermission) {
      throw new ApiError(StatusCodes.CONFLICT, 'Permission already exists');
    }

    const newPermission = await Permission.create({ name, label, module });

    return newPermission;
  };

  static getPermission = async (req) => {
    const permission = await Permission.findById(req.params.id);

    if (!permission)
      throw new ApiError(StatusCodes.NOT_FOUND, getReasonPhrase(StatusCodes.NOT_FOUND));

    return permission;
  };

  static getAllPermissions = async (req) => {
    const options = getPaginationOptions(req);
    const filter = getFilterOptions(req, ['module', 'label']);

    const permissions = await Permission.paginate(filter, options);
    return permissions;
  };

  static getAllModule = async (req) => {
    const modules = await Permission.find().sort({ createdAt: -1 }).distinct('module');
    return modules;
  };

  static updatePermission = async (req, res) => {
    const { id } = req.params;

    const permission = Permission.findByIdAndUpdate(
      { _id: id },
      {
        name: req.body.name,
        module: req.body.module,
        label: req.body.label,
      },
      { new: true }
    );

    if (!permission) {
      throw new ApiError(404, 'Permission not found');
    }

    return permission;
  };

  static deletePermission = async (req, res) => {
    const { id } = req.params;

    const permission = await Permission.findByIdAndDelete(id);

    if (!permission) {
      throw new ApiError(404, 'Permission not found');
    }

    await Role.updateMany({ permissions: id }, { $pull: { permissions: id } });

    return permission;
  };
}
