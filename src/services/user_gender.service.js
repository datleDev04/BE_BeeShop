import UserGender from '../models/User_Gender.js';
import { checkRecordByField } from '../utils/CheckRecord.js';
import { getFilterOptions, getPaginationOptions } from '../utils/pagination.js';
import { Transformer } from '../utils/transformer.js';

export class UserGenderService {
  static getAllUserGenders = async (req) => {
    const options = getPaginationOptions(req);
    const filter = getFilterOptions(req, ['name']);

    const paginatedLabels = await UserGender.paginate(filter, options);

    const { docs, ...otherFields } = paginatedLabels;

    const transformedTags = docs.map((label) =>
      Transformer.transformObjectTypeSnakeToCamel(label.toObject())
    );

    const others = {
      ...otherFields,
    };

    return {
      metaData: Transformer.removeDeletedField(transformedTags),
      others,
    };
  };

  static getOneUserGender = async (req) => {
    await checkRecordByField(UserGender, '_id', req.params.id, true);
    const userGender = await UserGender.findById(req.params.id);
    return Transformer.transformObjectTypeSnakeToCamel(userGender.toObject());
  };

  static createUserGender = async (req) => {
    const { name, description } = req.body;
    await checkRecordByField(UserGender, 'name', name, false);

    const newUserGender = await UserGender.create({
      name,
      description,
    });
    return Transformer.transformObjectTypeSnakeToCamel(newUserGender.toObject());
  };

  static updateUserGenderById = async (req) => {
    const { name, description } = req.body;

    await checkRecordByField(UserGender, 'name', name, false, req.params.id);

    await checkRecordByField(UserGender, '_id', req.params.id, true);

    const updatedUserGender = await UserGender.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
      },
      { new: true }
    );
    return Transformer.transformObjectTypeSnakeToCamel(updatedUserGender.toObject());
  };

  static deleteUserGenderBydId = async (req) => {
    await checkRecordByField(UserGender, '_id', req.params.id, true);
    await UserGender.findByIdAndDelete(req.params.id);
  };
}
