import Permission from '../models/Permission.js';
import Role from '../models/Role.js';
import { checkRecordByField } from '../utils/CheckRecord.js';
import { getFilterOptions, getPaginationOptions } from '../utils/pagination.js';
import { Transformer } from '../utils/transformer.js';

export default class PermissionService {
  static createNewPermission = async (req) => {
    const { name, label, module } = req.body;

    await checkRecordByField(Permission, 'name', name, false);
    await checkRecordByField(Permission, 'module', module, true);

    const newPermission = await Permission.create({ name, label, module });

    return Transformer.transformObjectTypeSnakeToCamel(newPermission.toObject());
  };

  static getPermission = async (req) => {
    await checkRecordByField(Permission, '_id', req.params.id, true);
    const permission = await Permission.findById(req.params.id);
    return Transformer.transformObjectTypeSnakeToCamel(permission.toObject());
  };

  static getAllPermissions = async (req) => {
    const options = getPaginationOptions(req);
    const filter = getFilterOptions(req, ['module', 'label']);

    const permissions = await Permission.paginate(filter, options);

    const { docs, ...otherFields } = permissions;

    const transformedPermission = docs.map((permission) =>
      Transformer.transformObjectTypeSnakeToCamel(permission.toObject())
    );

    const others = {
      ...otherFields,
    };

    return {
      metaData: Transformer.removeDeletedField(transformedPermission),
      others,
    };
  };

  static getAllModule = async (req) => {
    const modules = await Permission.find().sort({ createdAt: -1 }).distinct('module');
    return modules;
  };

  static updatePermission = async (req, res) => {
    const { id } = req.params;
    const { name, label, module } = req.body;

    await checkRecordByField(Permission, '_id', id, true);
    await checkRecordByField(Permission, 'name', name, false, id);

    await checkRecordByField(Permission, 'module', module, true);

    const permission = await Permission.findByIdAndUpdate(
      { _id: id },
      {
        name: name,
        module: module,
        label: label,
      },
      { new: true }
    );

    return Transformer.transformObjectTypeSnakeToCamel(permission.toObject());
  };

  static deletePermission = async (req, res) => {
    const { id } = req.params;
    await checkRecordByField(Permission, '_id', id, true);

    await Permission.findByIdAndDelete(id);

    await Role.updateMany({ permissions: id }, { $pull: { permissions: id } });
  };
}
