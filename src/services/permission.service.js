import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import Permisson from '../models/Permisson.js';
import Role from '../models/Role.js';
import ApiError from '../utils/ApiError.js';

export default class PermissionService {
  static createNewPermission = async (req) => {
    const { name, parent_id } = req.body;

    // check existed permissions
    const existedPermission = await Permisson.findOne({ name });
    if (existedPermission) {
      throw new ApiError(StatusCodes.CONFLICT, 'Permission already exists');
    }

    // check existed parent permissions
    const existedParentPermission = await Permisson.findOne({ _id: parent_id });
    if (!existedParentPermission) {
      throw new ApiError(StatusCodes.CONFLICT, 'Parent permission is not exists');
    }

    const newPermission = await Permisson.create(
      { name, parent_id: parent_id}
    );

    return newPermission;
  };

  static getPermission = async (req) => {
    const permission = await Permisson.findById(req.params.id).populate("parent_id").exec();

    if (!permission)
      throw new ApiError(StatusCodes.NOT_FOUND, getReasonPhrase(StatusCodes.NOT_FOUND));

    return permission;
  };

  static getAllPermissions = async (req) => {
    return await Permisson.find().populate("parent_id").exec();
  };

  static updatePermission = async (req, res) => {
    const { id } = req.params;

    const permission = Permisson.findByIdAndUpdate(
      { _id: id },
      { 
        name: req.body.name,
        parent_id: req.body.parent_id
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

    const permission = await Permisson.findByIdAndDelete(id);

    if (!permission) {
      throw new ApiError(404, 'Permission not found');
    }

    await Role.updateMany({ permissions: id }, { $pull: { permissions: id } });

    return permission;
  };
}
