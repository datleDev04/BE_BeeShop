import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import Permission from '../models/Permission.js';
import Role from '../models/Role.js';
import ApiError from '../utils/ApiError.js';

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
    };

    if (_pagination != true) {
      options = {
        pagination: false
      }
    }

    const { module, label } = req.body

    let filter = {}

    if (module) {
      filter.module =  { $regex: `.*${module}.*`, $options: 'i' };;
    }
  
    if (label) {
      filter.label = { $regex: `.*${label}.*`, $options: 'i' };
    }  

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
    )

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
