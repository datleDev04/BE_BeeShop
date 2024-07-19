import Role from '../models/Role.js';
import { getFilterOptions, getPaginationOptions } from '../utils/pagination.js';
import { Transformer } from '../utils/transformer.js';
import { checkRecordByField } from '../utils/CheckRecord.js';

export default class RoleService {
  static createNewRole = async (req) => {
    const { name, permissions } = req.body;

    await checkRecordByField(Role, 'name', name, false)

    await Role.create({ name, permissions });

    const newRole = await Role.findOne({ name }).populate('permissions').exec();

    return Transformer.transformObjectTypeSnakeToCamel(newRole.toObject())

  };

  static getAllRole = async (req) => {
    const options = getPaginationOptions(req);
    const filter = getFilterOptions(req, ['name']);

    const roles = await Role.paginate(filter, options);

    const paginatedRoles = await Role.populate(roles.docs, { path: 'permissions' });


    const transformedRole = paginatedRoles.map((role) =>
      Transformer.transformObjectTypeSnakeToCamel(role.toObject())
    );

    const { docs, ...otherFields } = roles;

    const other = {
      ...otherFields,
    };

    return {
      metaData: Transformer.removeDeletedField(transformedRole),
      other,
    }
  };

  static getOneRole = async (req) => {
    await checkRecordByField(Role, '_id', req.params.id, true)
    const role = await Role.findById(req.params.id).populate('permissions').exec();
    return Transformer.transformObjectTypeSnakeToCamel(role.toObject())

  };

  static updateRoleById = async (req) => {
    const { name, permissions } = req.body;
    const id = req.params.id;

    await checkRecordByField(Role, 'name', name, false, id)

    await checkRecordByField(Role, '_id', id, true)

    const updatedRole = await Role.findByIdAndUpdate(
      id,
      { name, permissions },
      { new: true })
      .populate('permissions').exec();

    return Transformer.transformObjectTypeSnakeToCamel(updatedRole.toObject())
  };

  static deleteRoleById = async (req) => {
    await checkRecordByField(Role, '_id', req.params.id, true)
    await Role.findByIdAndDelete(req.params.id);
  };
}
