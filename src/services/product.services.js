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

export default class ProductService {
  static createNewProduct = async (req) => {
    const { name, variants, product_colors } = req.body;

    await this.validateCreateProductData(req.body);

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

    return Transformer.transformObjectTypeSnakeToCamel(newProduct.toObject());
  };

  static updateProduct = async (req) => {
    const { name, variants, product_colors } = req.body;

    const productId = req.params.id;

    await this.validateUpdateProductData(req.body, productId);

    const product = await Product.findById(productId);

    let slug = product.slug;

    if (name && name !== product.name) {
      await checkRecordByField(Product, 'name', name, false, product._id);
      slug = await generateSlug(Product, name);
    }

    const [updatedVariantIds, updatedColorIds] = await Promise.all([
      this.updateVariants(product, variants),
      this.updateProductColors(product, product_colors),
    ]);

    await Product.findByIdAndUpdate(req.params.id, {
      ...req.body,
      slug,
      variants: updatedVariantIds,
      product_colors: updatedColorIds,
    });

    const updateProduct = await Product.findById(product._id).populate([
      {
        path: 'variants',
        populate: ['color', 'size'],
      },
      {
        path: 'tags',
      },
      {
        path: 'gender',
      },
      {
        path: 'labels',
      },
      {
        path: 'brand',
      },
      {
        path: 'product_colors',
        populate: {
          path: 'color_id',
        },
      },
      {
        path: 'product_sizes',
      },
    ]);

    return Transformer.transformObjectTypeSnakeToCamel(updateProduct.toObject());
  };

  static getAllProduct = async (req) => {
    const options = getPaginationOptions(req);
    const filter = getFilterOptions(req, ['name']);

    const paginatedProducts = await Product.paginate(filter, options);

    const populatedProducts = await Product.populate(paginatedProducts.docs, [
      {
        path: 'variants',
        populate: ['color', 'size'],
      },
      {
        path: 'tags',
      },
      {
        path: 'gender',
      },
      {
        path: 'labels',
      },
      {
        path: 'brand',
      },
      {
        path: 'product_colors',
        populate: {
          path: 'color_id',
        },
      },
      {
        path: 'product_sizes',
      },
    ]);
    const { docs, ...otherFields } = paginatedProducts;

    const transformedProducts = populatedProducts.map((product) =>
      Transformer.transformObjectTypeSnakeToCamel(product.toObject())
    );

    const others = {
      ...otherFields,
    };

    return {
      metaData: Transformer.removeDeletedField(transformedProducts),
      others,
    };
  };

  static getOneProduct = async (req) => {
    await checkRecordByField(Product, '_id', req.params.id, true);
    const product = await Product.findById(req.params.id).populate([
      {
        path: 'variants',
        populate: ['color', 'size'],
      },
      {
        path: 'tags',
      },
      {
        path: 'gender',
      },
      {
        path: 'labels',
      },
      {
        path: 'brand',
      },
      {
        path: 'product_colors',
        populate: {
          path: 'color_id',
        },
      },
      {
        path: 'product_sizes',
      },
    ]);
    return Transformer.transformObjectTypeSnakeToCamel(product.toObject());
  };

  static deleteProduct = async (req) => {
    await checkRecordByField(Product, '_id', req.params.id, true);
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    await Promise.all([
      Variant.deleteMany({ _id: { $in: deletedProduct.variants } }),
      Product_Color.deleteMany({ _id: { $in: deletedProduct.product_colors } }),
    ]);

    return null;
  };

  // create product helpers
  static async validateCreateProductData(body) {
    await Promise.all([
      checkRecordByField(Product, 'name', body.name, false),
      checkRecordsByIds(Tags, body.tags),
      checkRecordsByIds(Label, body.labels),
      checkRecordsByIds(Size, body.product_sizes),
      checkRecordByField(Brand, '_id', body.brand, true),
      checkRecordByField(Gender, '_id', body.gender, true),
      checkRecordByField(ProductType, '_id', body.product_type, true),
    ]);
  }

  static async createColorsAndVariants(productColors, variants) {
    const [createdProductColors, createdVariants] = await Promise.all([
      Promise.all(productColors.map((color) => Product_Color.create(color))),
      Promise.all(variants.map((variant) => Variant.create(variant))),
    ]);

    const productColorIds = createdProductColors.map((color) => color._id);
    const variantIds = createdVariants.map((variant) => variant._id);

    return [productColorIds, variantIds];
  }

  //update product helpers
  static async validateUpdateProductData(body, id) {
    await Promise.all([
      checkRecordByField(Product, '_id', id, true),
      checkRecordsByIds(Tags, body.tags),
      checkRecordsByIds(Label, body.labels),
      checkRecordsByIds(Size, body.product_sizes),
      checkRecordByField(Brand, '_id', body.brand, true),
      checkRecordByField(Gender, '_id', body.gender, true),
      checkRecordByField(ProductType, '_id', body.product_type, true),
    ]);
  }

  static async updateVariants(product, variants) {
    const existingVariantIds = product.variants;

    const updatedVariantIds = await Promise.all(
      variants.map(async (variant) => {
        if (variant._id) {
          await Variant.findByIdAndUpdate(variant._id, variant);
          return variant._id;
        } else {
          const newVariant = await Variant.create(variant);
          return newVariant._id;
        }
      })
    );

    const variantsToRemove = existingVariantIds.filter(
      (id) => !updatedVariantIds.includes(id.toString())
    );
    await Variant.deleteMany({ _id: { $in: variantsToRemove } });

    return updatedVariantIds;
  }

  static async updateProductColors(product, newColors = []) {
    await Product_Color.deleteMany({ _id: { $in: product.product_colors } });
    const createdColors = await Product_Color.create(newColors);
    const colorIds = createdColors.map((color) => color._id);
    return colorIds;
  }
}
