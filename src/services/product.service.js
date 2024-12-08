import Product from '../models/Product.js';
import Product_Color from '../models/Product_Color.js';
import Variant from '../models/Variant.js';
import { checkRecordByField, checkRecordsByIds } from '../utils/CheckRecord.js';
import { Transformer } from '../utils/transformer.js';
import { getFilterOptions, getPaginationOptions } from '../utils/pagination.js';
import { generateSlug } from '../utils/GenerateSlug.js';
import Tags from '../models/Tags.js';
import Label from '../models/Label.js';
import Brand from '../models/Brand.js';
import Gender from '../models/Gender.js';
import Size from '../models/Size.js';
import ProductType from '../models/Product_Type.js';
import { STATUS } from '../utils/constants.js';
import ApiError from '../utils/ApiError.js';
import { StatusCodes } from 'http-status-codes';

const populateOptions = [
  { path: 'variants', populate: ['color', 'size'] },
  { path: 'tags' },
  { path: 'gender' },
  { path: 'labels' },
  { path: 'brand' },
  { path: 'product_colors', populate: { path: 'color_id' } },
  { path: 'product_sizes' },
  { path: 'product_type' },
];

export default class ProductService {
  static createNewProduct = async (req) => {
    const { name, variants, product_colors } = req.body;

    await this.validateProductData(req.body);

    const slug = await generateSlug(Product, name);

    const [productColorIds, variantIds] = await this.createColorsAndVariants(
      product_colors,
      variants
    );

    const newProduct = await Product.create({
      ...req.body,
      slug,
      product_colors: productColorIds,
      variants: variantIds,
    });

    return this.getPopulatedProduct(newProduct._id);
  };

  static updateProduct = async (req) => {
    const { name, variants, product_colors } = req.body;

    const productId = req.params.id;

    await this.validateProductData(req.body, productId);

    const product = await Product.findById(productId);

    let slug = product.slug;

    if (name && name !== product.name) {
      await checkRecordByField(Product, 'name', name, false, product._id);
      slug = await generateSlug(Product, name);
    }

    const [updatedVariantIds, updatedColorIds] = await Promise.all([
      this.updateVariants(product.variants, variants),
      this.updateProductColors(product.product_colors, product_colors),
    ]);

    await Product.findByIdAndUpdate(req.params.id, {
      ...req.body,
      slug,
      variants: updatedVariantIds,
      product_colors: updatedColorIds,
    });

    const updatedProduct = await this.getPopulatedProduct(productId);

    return updatedProduct;
  };

  static getAllProduct = async (req) => {
    const options = getPaginationOptions(req);
    const filter = getFilterOptions(req, ['name', 'status']);

    const { docs, ...otherFields } = await Product.paginate(filter, {
      ...options,
      populate: populateOptions,
    });

    const transformedProducts = docs.map((product) =>
      Transformer.transformObjectTypeSnakeToCamel(product.toObject())
    );

    return {
      metaData: Transformer.removeDeletedField(transformedProducts),
      others: otherFields,
    };
  };

  static clientGetAllProduct = async (req) => {
    const options = getPaginationOptions(req);
    const filter = getFilterOptions(req, [
      'name',
      'status',
      'brand',
      'tags',
      'gender',
      'labels',
      'slug',
    ]);

    // set default status is active
    filter.status = STATUS.ACTIVE;

    const { docs, ...otherFields } = await Product.paginate(filter, {
      ...options,
      populate: populateOptions,
    });

    const transformedProducts = docs.map((product) =>
      Transformer.transformObjectTypeSnakeToCamel(product.toObject())
    );

    return {
      metaData: Transformer.removeDeletedField(transformedProducts),
      others: otherFields,
    };
  };

  static getOneProduct = async (req) => {
    const { id } = req.params;
    await checkRecordByField(Product, '_id', id, true);
    const product = await this.getPopulatedProduct(id);
    return product;
  };

  static deleteProduct = async (req) => {
    await checkRecordByField(Product, '_id', req.params.id, true);

    const currentProduct = await Product.findById(req.params.id);

    if (!currentProduct.enable_delete) {
      throw new ApiError(StatusCodes.CONFLICT, {
        message: 'Không thể xóa sản phẩm này',
      });
    }

    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    await Promise.all([
      Variant.deleteMany({ _id: { $in: deletedProduct.variants } }),
      Product_Color.deleteMany({ _id: { $in: deletedProduct.product_colors } }),
    ]);

    return null;
  };

  // create product helpers
  static async validateProductData(data, id = null) {
    const checks = [
      checkRecordsByIds(Tags, data.tags),
      checkRecordsByIds(Label, data.labels),
      checkRecordsByIds(Size, data.product_sizes),
      checkRecordByField(Brand, '_id', data.brand, true),
      checkRecordByField(Gender, '_id', data.gender, true),
      checkRecordByField(ProductType, '_id', data.product_type, true),
    ];

    if (id) {
      checks.push(checkRecordByField(Product, '_id', id, true));
    } else {
      checks.push(checkRecordByField(Product, 'name', data.name, false));
    }

    await Promise.all(checks);
  }

  static async createColorsAndVariants(productColors, variants) {
    const [createdProductColors, createdVariants] = await Promise.all([
      Product_Color.insertMany(productColors),
      Variant.insertMany(variants),
    ]);

    return [
      createdProductColors.map((color) => color._id),
      createdVariants.map((variant) => variant._id),
    ];
  }

  static async updateVariants(existingVariantIds, newVariants) {
    const existingVariantIdsStrings = existingVariantIds.map((id) => id.toString());

    const updatePromises = newVariants.map((variant) =>
      variant.id
        ? Variant.findByIdAndUpdate(variant.id, variant, { new: true, runValidators: true })
        : Variant.create(variant)
    );

    const updatedVariants = await Promise.all(updatePromises);
    const updatedVariantIds = updatedVariants.map((variant) => variant._id.toString());

    const variantsToRemove = existingVariantIdsStrings.filter(
      (id) => !updatedVariantIds.includes(id)
    );

    if (variantsToRemove.length > 0) {
      await Variant.deleteMany({ _id: { $in: variantsToRemove } });
    }

    return updatedVariantIds;
  }

  static async updateProductColors(existingColorIds, newColors = []) {
    await Product_Color.deleteMany({ _id: { $in: existingColorIds } });
    const createdColors = await Product_Color.insertMany(newColors);
    return createdColors.map((color) => color._id);
  }

  static async getPopulatedProduct(id) {
    const product = await Product.findById(id).populate(populateOptions);
    return Transformer.transformObjectTypeSnakeToCamel(product.toObject());
  }
}
