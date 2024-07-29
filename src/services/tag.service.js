import Tags from '../models/Tags.js';
import { checkRecordByField } from '../utils/CheckRecord.js';
import { getFilterOptions, getPaginationOptions } from '../utils/pagination.js';
import { Transformer } from '../utils/transformer.js';

export class TagService {
  static getAllTags = async (req) => {
    const options = getPaginationOptions(req);
    const filter = getFilterOptions(req, ['name']);

    const paginatedLabels = await Tags.paginate(filter, options);

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

  static getOneTag = async (req) => {
    await checkRecordByField(Tags, '_id', req.params.id, true);
    const tag = await Tags.findById(req.params.id);
    return Transformer.transformObjectTypeSnakeToCamel(tag.toObject());
  };

  static createTag = async (req) => {
    const { name, description } = req.body;
    await checkRecordByField(Tags, 'name', name, false);

    const newTag = await Tags.create({
      name,
      description,
    });
    return Transformer.transformObjectTypeSnakeToCamel(newTag.toObject());
  };

  static updateTagById = async (req) => {
    const { name, description } = req.body;

    await checkRecordByField(Tags, 'name', name, false, req.params.id);

    await checkRecordByField(Tags, '_id', req.params.id, true);

    const updatedTag = await Tags.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
      },
      { new: true }
    );
    return Transformer.transformObjectTypeSnakeToCamel(updatedTag.toObject());
  };

  static deleteTagById = async (req) => {
    return await Tags.findByIdAndDelete(req.params.id);
  };
}
