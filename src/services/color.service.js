import Color from '../models/Color.js';
import { Transformer } from '../utils/transformer.js';
import { checkRecordByField } from '../utils/CheckRecord.js';
import { getFilterOptions, getPaginationOptions } from '../utils/pagination.js';
import Product from '../models/Product.js';
import Product_Color from '../models/Product_Color.js';
import ApiError from '../utils/ApiError.js';
import { StatusCodes } from 'http-status-codes';

export default class ColorService {
  static createNewColor = async (req) => {
    const { name, value } = req.body;

    await checkRecordByField(Color, 'name', name, false);

    const newColor = await Color.create({ name, value });

    return Transformer.transformObjectTypeSnakeToCamel(newColor.toObject());
  };

  static getAllColor = async (req) => {
    const options = getPaginationOptions(req);
    const filter = getFilterOptions(req, ['name', 'value']);

    // First, fetch colors with pagination
    const paginatedColors = await Color.paginate(filter, options);
    const { docs, ...otherFields } = paginatedColors;

    const colorsWithProductCount = await Promise.all(
      docs.map(async (color) => {
        const productColorDocs = await Product_Color.find({ color_id: color._id });

        const productCount = await Product.countDocuments({
          product_colors: {
            $in: productColorDocs.map((pc) => pc._id),
          },
        });

        const colorObject = color.toObject();
        colorObject.product_count = productCount;

        return colorObject;
      })
    );

    const transformedColors = colorsWithProductCount.map((color) =>
      Transformer.transformObjectTypeSnakeToCamel(color)
    );

    return {
      metaData: Transformer.removeDeletedField(transformedColors),
      others: otherFields,
    };
  };

  static getOneColor = async (req) => {
    await checkRecordByField(Color, '_id', req.params.id, true);
    const color = await Color.findById(req.params.id);
    return Transformer.transformObjectTypeSnakeToCamel(color.toObject());
  };

  static updateColorById = async (req) => {
    const { name, value } = req.body;

    if (name) {
      await checkRecordByField(Color, 'name', name, false, req.params.id);
    }

    await checkRecordByField(Color, '_id', req.params.id, true);

    const updatedColor = await Color.findByIdAndUpdate(
      req.params.id,
      { name, value },
      { new: true }
    );

    return Transformer.transformObjectTypeSnakeToCamel(updatedColor.toObject());
  };

  static deleteColorById = async (req) => {
    await checkRecordByField(Color, '_id', req.params.id, true);

    const productColorDocs = await Product_Color.find({ color_id: req.params.id });

    const productCount = await Product.countDocuments({
      product_colors: {
        $in: productColorDocs.map((pc) => pc._id),
      },
    });

    if (productCount > 0) {
      throw new ApiError(StatusCodes.CONFLICT, {
        message: 'Không thể xóa màu này',
      });
    }

    return await Color.findByIdAndDelete(req.params.id);
  };
}
