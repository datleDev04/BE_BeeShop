import { StatusCodes } from 'http-status-codes';
import Brand from '../models/Brand.js';
import ApiError from '../utils/ApiError.js';
import { Transformer } from '../utils/transformer.js';
import { getFilterOptions, getPaginationOptions } from '../utils/pagination.js';
import { checkRecordByField } from '../utils/CheckRecord.js';

export default class BrandService {
  static handleGetAllBrand = async (req) => {
    const options = getPaginationOptions(req);
    const filter = getFilterOptions(req, ['name']);

    const paginatedBrands = await Brand.paginate(filter, options);

    const { docs, ...otherFields } = paginatedBrands;

    const transformedBrands = docs.map((brand) => {
      return Transformer.transformObjectTypeSnakeToCamel(brand.toObject());
    });
    const others = {
      ...otherFields,
    };
    return {
      metaData: Transformer.removeDeletedField(transformedBrands),
      others,
    };
  };

  static handleGetOneBrand = async (req) => {
    await checkRecordByField(Brand, '_id', req.params.id, true);
    const data = await Brand.findById(req.params.id);
    const brand = Transformer.transformObjectTypeSnakeToCamel(data.toObject());

    return brand;
  };

  static handleCreateBrand = async (req) => {
    const { name, image, description } = req.body;
    await checkRecordByField(Brand, 'name', name, false);

    const newBrand = await Brand.create({
      name,
      image,
      description,
    });
    const data = Transformer.transformObjectTypeSnakeToCamel(newBrand.toObject());

    return data;
  };

  static handleUpdateBrand = async (req) => {
    const { name, image, description } = req.body;

    await checkRecordByField(Brand, '_id', req.params.id, true);
    await checkRecordByField(Brand, 'name', name, false, req.params.id);

    const updateBrand = await Brand.findByIdAndUpdate(
      req.params.id,
      { name, image, description },
      { new: true, runValidators: true }
    );

    if (!updateBrand) {
      throw new ApiError(StatusCodes.CONFLICT, 'This brand is not available');
    }
    const responseData = Transformer.transformObjectTypeSnakeToCamel(updateBrand.toObject());
    return responseData;
  };

  static handleDeleteBrand = async (req) => {
    const { id } = req.params;
    await checkRecordByField(Brand, '_id', id, true);

    await Brand.findByIdAndDelete(id);
  };
}
