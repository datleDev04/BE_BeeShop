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

export default class ProductService {
  static createNewProduct = async (req) => {
    const { name, variants, product_colors, tags, brand, product_sizes, labels, gender } = req.body;

    await checkRecordByField(Product, 'name', name, false);

    await checkRecordsByIds(Tags, tags);
    await checkRecordsByIds(Label, labels);
    await checkRecordsByIds(Size, product_sizes);

    await checkRecordByField(Brand, '_id', brand, true);
    await checkRecordByField(Gender, '_id', gender, true);

    const productColors = await Product_Color.create(product_colors);
    const productVariants = await Variant.create(variants);

    const productColorIds = productColors.map((color) => color._id);
    const productVariantIds = productVariants.map((variant) => variant._id);

    const slug = await generateSlug(Product, name);

    const newProduct = await Product.create({
      ...req.body,
      slug,
      product_colors: productColorIds,
      variants: productVariantIds,
    });

    return Transformer.transformObjectTypeSnakeToCamel(newProduct.toObject());
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

  static updateProduct = async (req) => {
    const {
      name,
      description,
      regular_price,
      discount_price,
      images,
      tags,
      gender,
      variants,
      labels,
      is_public,
      brand,
      product_colors,
      product_sizes,
    } = req.body;

    const productId = req.params.id;

    await checkRecordByField(Product, '_id', productId, true);
    await checkRecordByField(Product, 'name', name, false, productId);

    const slug = await generateSlug(Product, name);

    const product = await Product.findById(productId);

    /// delete or add new variant
    await Promise.all(
      variants.map(async (variant) => {
        if (variant._id) {
          await Variant.findByIdAndUpdate(variant._id, variant);
        } else {
          const newVariant = await Variant.create({
            ...variant,
            product_id: product._id,
          });
          product.variants.push(newVariant._id);
        }
      })
    );

    //delete product color of product
    await Product_Color.deleteMany({ _id: { $in: product.product_colors } });
    //
    const productColors = await Product_Color.create(product_colors);

    product.name = name || product.name;
    product.slug = slug || product.slug;
    product.description = description || product.description;
    product.regular_price = regular_price || product.regular_price;
    product.discount_price = discount_price || product.discount_price;
    product.images = images || product.images;
    product.tags = tags || product.tags;
    product.gender = gender || product.gender;
    product.labels = labels || product.labels;
    product.is_public = is_public !== undefined ? is_public : product.is_public;
    product.brand = brand || product.brand;
    product.product_sizes = product_sizes || product.product_sizes;
    product.product_colors = productColors.map((color) => color._id);

    await product.save();

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

  static deleteProduct = async (req) => {
    await checkRecordByField(Product, '_id', req.params.id, true);
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    console.log(deletedProduct);

    await Variant.deleteMany({ _id: { $in: deletedProduct.variants } });

    await Product_Color.deleteMany({ _id: { $in: deletedProduct.product_colors } });

    return null;
  };
}
