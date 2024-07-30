import Gender from '../models/Gender.js';
import { checkRecordByField } from '../utils/CheckRecord.js';
import { Transformer } from '../utils/transformer.js';
import { getFilterOptions, getPaginationOptions } from '../utils/pagination.js';
import { generateSlug } from '../utils/GenerateSlug.js';

export default class GenderService {
  static createNewGender = async (req) => {
    const { name } = req.body;

    await checkRecordByField(Gender, 'name', name, false);

    const slug = await generateSlug(Gender, name);

    const newGender = await Gender.create({ name, slug });
    return Transformer.transformObjectTypeSnakeToCamel(newGender.toObject());
  };

  static getAllGender = async (req) => {
    const options = getPaginationOptions(req);
    const filter = getFilterOptions(req, ['name']);

    const paginatedGenders = await Gender.paginate(filter, options);

    const { docs, ...otherFields } = paginatedGenders;

    const transformedGenders = docs.map((label) =>
      Transformer.transformObjectTypeSnakeToCamel(label.toObject())
    );

    const others = {
      ...otherFields,
    };

    return {
      metaData: Transformer.removeDeletedField(transformedGenders),
      others,
    };
  };

  static getOneGender = async (req) => {
    await checkRecordByField(Gender, '_id', req.params.id, true);
    const gender = await Gender.findById(req.params.id);
    return Transformer.transformObjectTypeSnakeToCamel(gender.toObject());
  };

  static updateGenderById = async (req) => {
    const { name } = req.body;

    await checkRecordByField(Gender, 'name', name, false, req.params.id);
    await checkRecordByField(Gender, '_id', req.params.id, true);

    const slug = await generateSlug(Gender, name);
    const updatedGender = await Gender.findByIdAndUpdate(
      req.params.id,
      {
        name,
        slug,
      },
      { new: true }
    );

    return Transformer.transformObjectTypeSnakeToCamel(updatedGender.toObject());
  };

  static deleteGenderById = async (req) => {
    await checkRecordByField(Gender, '_id', req.params.id, true);
    return await Gender.findByIdAndDelete(req.params.id);
  };
}
