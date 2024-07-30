import ProductType from '../models/Product_Type.js';
import { generateSlug } from '../utils/GenerateSlug.js';
import { Transformer } from '../utils/transformer.js';
import { getFilterOptions, getPaginationOptions } from '../utils/pagination.js';
import { checkRecordByField } from '../utils/CheckRecord.js';

export default class ProductTypeService {
  static createProductType = async (req) => {
    const { name } = req.body;

    await checkRecordByField(ProductType, 'name', name, false);

    const slug = await generateSlug(ProductType, name);

    const newProductTypes = await ProductType.create({ name, slug });

    return Transformer.transformObjectTypeSnakeToCamel(newProductTypes.toObject());
  };

  static getAllProductType = async (req) => {
    const options = getPaginationOptions(req);
    const filter = getFilterOptions(req, ['name']);

    const paginatedTypes = await ProductType.paginate(filter, options);

    const { docs, ...otherFields } = paginatedTypes;

    const transformedTypes = docs.map((type) =>
      Transformer.transformObjectTypeSnakeToCamel(type.toObject())
    );

    const others = {
      ...otherFields,
    };

    return {
      metaData: Transformer.removeDeletedField(transformedTypes),
      others,
    };
  };

  static getOneProductType = async (req) => {
    await checkRecordByField(ProductType, '_id', req.params.id, true);
    const type = await ProductType.findById(req.params.id);
    return Transformer.transformObjectTypeSnakeToCamel(type.toObject());
  };

  static updateProductType = async (req) => {
    const { name } = req.body;

    await checkRecordByField(ProductType, 'name', name, false, req.params.id);

    await checkRecordByField(ProductType, '_id', req.params.id, true);

    const slug = await generateSlug(ProductType, name);

    const updatedProductType = await ProductType.findByIdAndUpdate(
      req.params.id,
      { name, slug },
      { new: true, runValidators: true }
    );

    return Transformer.transformObjectTypeSnakeToCamel(updatedProductType.toObject());
  };

  static deleteProductType = async (req) => {
    await checkRecordByField(ProductType, '_id', req.params.id, true);
    return await ProductType.findByIdAndDelete(req.params.id);
  };
}
