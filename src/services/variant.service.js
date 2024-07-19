import Variant from '../models/Variant.js';
import { checkRecordByField } from '../utils/CheckRecord.js';
import { Transformer } from '../utils/transformer.js';

export class VariantService {
  static getAllVariants = async (req) => {
    const options = getPaginationOptions(req);
    const filter = getFilterOptions(req, []);

    const paginatedVariants = await Variant.paginate(filter, options);

    const { docs, ...otherFields } = paginatedVariants;

    const transformedVariants = docs.map((variant) =>
      Transformer.transformObjectTypeSnakeToCamel(variant.toObject())
    );

    const others = {
      ...otherFields,
    };

    return {
      metaData: Transformer.removeDeletedField(transformedVariants),
      others,
    };
  };

  static getOneVariant = async (req) => {
    await checkRecordByField(Variant, '_id', req.params.id, true);
    const variant = await Variant.findById(req.params.id);
    return Transformer.transformObjectTypeSnakeToCamel(variant.toObject());
  };
  static createVariant = async (req) => {
    const newVariant = await Variant.create(req.body);
    return Transformer.transformObjectTypeSnakeToCamel(newVariant.toObject());
  };

  static updateVariantById = async (req) => {
    await checkRecordByField(Variant, '_id', req.params.id, true);

    const updatedVariant = await Variant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return Transformer.transformObjectTypeSnakeToCamel(updatedVariant.toObject());
  };

  static deleteVariantBydId = async (req) => {
    await checkRecordByField(Variant, '_id', req.params.id, true);
    return await Variant.findByIdAndDelete(req.params.id);
  };
}
