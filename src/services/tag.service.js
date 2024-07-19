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

    const transformedLabels = docs.map((label) =>
      Transformer.transformObjectTypeSnakeToCamel(label.toObject())
    );

    const others = {
      ...otherFields,
    };

    return {
      metaData: Transformer.removeDeletedField(transformedLabels),
      others,
    }
  };

  static getOneTag = async (req) => {
    await checkRecordByField(Tags, '_id', req.params.id, true)
    const Tags = await Tags.findById(req.params.id);
    return Transformer.transformObjectTypeSnakeToCamel(Tags.toObject())
  };

  static createTag = async (req) => {
    const { name, description } = req.body;
    await checkRecordByField(Tags, 'name', name, false)    

    const newTag = await Tags.create({
      name,
      description,
    });
    return newTag;
  };

  static updateTagById = async (req) => {
    const { name, description } = req.body;

    // check existed tag name
    const existedTagName = await Tags.findOne({ name });
    if (existedTagName) {
      throw new ApiError(StatusCodes.CONFLICT, 'Tag name already exists');
    }

    const updatedTag = await Tags.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
      },
      { new: true }
    );
    return updatedTag;
  };

  static deleteTagBydId = async (req) => {
    return await Tags.findByIdAndDelete(req.params.id);
  };
}
