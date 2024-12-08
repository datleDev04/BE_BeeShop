import Gender from '../models/Gender.js';
import { checkRecordByField } from '../utils/CheckRecord.js';
import { Transformer } from '../utils/transformer.js';
import { getFilterOptions, getPaginationOptions } from '../utils/pagination.js';
import { generateSlug } from '../utils/GenerateSlug.js';
import Product from '../models/Product.js';
import ApiError from '../utils/ApiError.js';
import { StatusCodes } from 'http-status-codes';

export default class GenderService {
  static createNewGender = async (req) => {
    const { name } = req.body;

    await checkRecordByField(Gender, 'name', name, false);

    const slug = await generateSlug(Gender, name);

    const newGender = await Gender.create({ name, slug, ...req.body });
    return Transformer.transformObjectTypeSnakeToCamel(newGender.toObject());
  };

  static getAllGender = async (req) => {
    const options = getPaginationOptions(req);
    const filter = getFilterOptions(req, ['name']);

    const paginatedGenders = await Gender.paginate(filter, options);
    const { docs, ...otherFields } = paginatedGenders;

    const gendersWithProductCount = await Promise.all(
      docs.map(async (gender) => {
        const productCount = await Product.countDocuments({
          gender: gender._id,
        });

        const genderObject = gender.toObject();
        genderObject.product_count = productCount;

        return genderObject;
      })
    );

    const transformedGenders = gendersWithProductCount.map((gender) =>
      Transformer.transformObjectTypeSnakeToCamel(gender)
    );

    return {
      metaData: Transformer.removeDeletedField(transformedGenders),
      others: otherFields,
    };
  };

  static getOneGender = async (req) => {
    await checkRecordByField(Gender, '_id', req.params.id, true);
    const gender = await Gender.findById(req.params.id);
    return Transformer.transformObjectTypeSnakeToCamel(gender.toObject());
  };

  static updateGenderById = async (req) => {
    const { name } = req.body;

    await checkRecordByField(Gender, '_id', req.params.id, true);

    const currentGender = await Gender.findById(req.params.id);

    let slug = currentGender.slug;

    if (name && name !== currentGender.name) {
      await checkRecordByField(Gender, 'name', name, false, req.params.id);
      slug = await generateSlug(Gender, name);
    }

    const updatedGender = await Gender.findByIdAndUpdate(
      req.params.id,
      {
        name,
        slug,
        ...req.body,
      },
      { new: true }
    );

    return Transformer.transformObjectTypeSnakeToCamel(updatedGender.toObject());
  };

  static deleteGenderById = async (req) => {
    await checkRecordByField(Gender, '_id', req.params.id, true);
    const productCount = await Product.countDocuments({
      gender: req.params.id,
    });

    if (productCount > 0) {
      throw new ApiError(StatusCodes.CONFLICT, {
        message: 'Không thể xóa giới tính này',
      });
    }
    return await Gender.findByIdAndDelete(req.params.id);
  };
}
