import Product from '../models/Product.js';
import Tags from '../models/Tags.js';
import ApiError from '../utils/ApiError.js';
import { checkRecordByField } from '../utils/CheckRecord.js';
import { STATUS } from '../utils/constants.js';
import { generateSlug } from '../utils/GenerateSlug.js';
import { getFilterOptions, getPaginationOptions } from '../utils/pagination.js';
import { Transformer } from '../utils/transformer.js';

export class TagService {
  static getAllTagsClient = async (req) => {
    const options = getPaginationOptions(req);
    const filter = getFilterOptions(req, ['name']);

    filter.status = STATUS.ACTIVE;

    const paginatedLabels = await Tags.paginate(filter, options);

    const { docs, ...otherFields } = paginatedLabels;

    const transformedTags = docs.map((tag) =>
      Transformer.transformObjectTypeSnakeToCamel(tag.toObject())
    );

    const others = {
      ...otherFields,
    };

    return {
      metaData: Transformer.removeDeletedField(transformedTags),
      others,
    };
  };
  static getAllTags = async (req) => {
    const options = getPaginationOptions(req);
    const filter = getFilterOptions(req, ['name', 'parent_id', 'status']);

    options.populate = { path: 'parent_id' };

    const paginatedLabels = await Tags.paginate(filter, options);

    const { docs, ...otherFields } = paginatedLabels;

    const tagsWithProductCount = await Promise.all(
      docs.map(async (tag) => {
        const productCount = await Product.countDocuments({
          tags: tag._id,
        });

        const tagObject = tag.toObject();
        tagObject.product_count = productCount;

        return tagObject;
      })
    );

    const transformedTags = tagsWithProductCount.map((tag) =>
      Transformer.transformObjectTypeSnakeToCamel(tag)
    );

    return {
      metaData: Transformer.removeDeletedField(transformedTags),
      others: otherFields,
    };
  };

  static getOneTag = async (req) => {
    await checkRecordByField(Tags, '_id', req.params.id, true);
    const tag = await Tags.findById(req.params.id).populate('parent_id');
    return Transformer.transformObjectTypeSnakeToCamel(tag.toObject());
  };

  static createTag = async (req) => {
    const { name, description, parent_id, image } = req.body;
    await checkRecordByField(Tags, 'name', name, false);

    if (parent_id) {
      await checkRecordByField(Tags, '_id', parent_id, true);
    }

    const slug = await generateSlug(Tags, name);

    const newTag = await Tags.create({
      name,
      slug,
      image,
      description,
      parent_id,
      image,
    });
    return Transformer.transformObjectTypeSnakeToCamel(newTag.toObject());
  };

  static updateTagById = async (req) => {
    const { name, description, parent_id, image, status } = req.body;

    await checkRecordByField(Tags, '_id', req.params.id, true);

    if (parent_id == req.params.id) {
      throw new ApiError(400, 'Parent tag cannot be itself');
    }

    const listChildrenTag = await Tags.find({ parent_id: req.params.id });

    const hasInvalidTag = listChildrenTag.some((tag) => tag._id == parent_id);

    if (hasInvalidTag) {
      throw new ApiError(400, 'Parent tag cannot be its children');
    }

    const slug = await generateSlug(Tags, name);

    if (parent_id) {
      await checkRecordByField(Tags, '_id', parent_id, true);
    }

    const updatedTag = await Tags.findByIdAndUpdate(
      req.params.id,
      {
        name,
        slug,
        description,
        parent_id,
        image,
        status,
      },
      { new: true }
    ).populate('parent_id');

    const productCount = await Product.countDocuments({
      tags: updatedTag._id,
    });

    const tagObject = updatedTag.toObject();
    tagObject.product_count = productCount;

    return Transformer.transformObjectTypeSnakeToCamel(tagObject);
  };

  static deleteTagById = async (req) => {
    const productCount = await Product.countDocuments({
      tags: req.params.id,
    });
    if (productCount > 0) {
      throw new ApiError(StatusCodes.CONFLICT, {
        message: 'Không thể xóa thẻ  này',
      });
    }
    await Tags.updateMany({ parent_id: req.params.id }, { $unset: { parent_id: '' } });
    await Tags.findByIdAndDelete(req.params.id);
  };
}
