import { StatusCodes } from 'http-status-codes';
import Brand from '../models/Brand.js';
import ApiError from '../utils/ApiError.js';
import { Transformer } from '../utils/transformer.js';
import { getFilterOptions, getPaginationOptions } from '../utils/pagination.js';
import { checkRecordByField } from '../utils/CheckRecord.js';
import { generateSlug } from '../utils/GenerateSlug.js';
import Product from '../models/Product.js';

export default class BrandService {
  static handleGetAllBrand = async (req) => {
    const options = getPaginationOptions(req);
    const filter = getFilterOptions(req, ['name']);

    // Fetch brands with pagination
    const paginatedBrands = await Brand.paginate(filter, options);
    const { docs, ...otherFields } = paginatedBrands;

    const brandsWithProductCount = await Promise.all(
      docs.map(async (brand) => {
        const productCount = await Product.countDocuments({
          brand: brand._id,
        });

        const brandObject = brand.toObject();
        brandObject.product_count = productCount;

        return brandObject;
      })
    );

    const transformedBrands = brandsWithProductCount.map((brand) =>
      Transformer.transformObjectTypeSnakeToCamel(brand)
    );

    return {
      metaData: Transformer.removeDeletedField(transformedBrands),
      others: otherFields,
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

    const slug = await generateSlug(Brand, name);

    const newBrand = await Brand.create({
      name,
      image,
      description,
      slug,
    });
    const data = Transformer.transformObjectTypeSnakeToCamel(newBrand.toObject());

    return data;
  };

  static handleUpdateBrand = async (req) => {
    const { name, image, description } = req.body;

    await checkRecordByField(Brand, '_id', req.params.id, true);

    const currentBrand = await Brand.findById(req.params.id);

    let slug = currentBrand.slug;

    if (name && name !== currentBrand.name) {
      await checkRecordByField(Brand, 'name', name, false, req.params.id);
      slug = await generateSlug(Brand, name);
    }

    const updateBrand = await Brand.findByIdAndUpdate(
      req.params.id,
      { name, image, description, slug },
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

    const productCount = await Product.countDocuments({
      brand: id,
    });

    if (productCount > 0) {
      throw new ApiError(StatusCodes.CONFLICT, {
        message: 'Không thể xóa thương hiệu này',
      });
    }

    await Brand.findByIdAndDelete(id);
  };
}
