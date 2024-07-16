import { StatusCodes } from 'http-status-codes';
import Product from '../models/Product.js';
import ApiError from '../utils/ApiError.js';
import Product_Color from '../models/Product_Color.js';
import Product_Size from '../models/Product_Size.js';
import Variant from '../models/Variant.js';

export default class ProductService {
  static createNewProduct = async (req) => {
    const {
      name,
      slug_name,
      description,
      regular_price,
      discount_price,
      images,
      tags,
      gender,
      variants,
      labels,
      isPublic,
      brand,
      product_colors,
      product_sizes,
    } = req.body;

    const productColors = await Product_Color.create(product_colors);
    const productSizes = await Product_Size.create(product_sizes);

    const existingName = await Product.findOne({ name });

    if (existingName) {
      throw new ApiError(StatusCodes.CONFLICT, 'This product name is existed');
    }

    const existingSlug = await Product.findOne({ slug_name });

    if (existingSlug) {
      throw new ApiError(StatusCodes.CONFLICT, 'This product slug is existed');
    }

    const newProduct = await Product.create({
      name,
      slug_name,
      description,
      discount_price,
      regular_price,
      images,
      isPublic,
      labels,
      brand,
      tags,
      variants: [],
      gender,
      product_colors: productColors.map((color) => color._id),
      product_sizes: productSizes.map((size) => size._id),
    });

    const productVariants = await Variant.create(
      variants.map((variant) => ({
        ...variant,
        product_id: newProduct._id,
      }))
    );

    newProduct.variants = productVariants.map((variant) => variant._id);

    await newProduct.save();

    return await Product.findById(newProduct._id);
  };

  static getAllProduct = async (req) => {
    const products = await Product.find().populate([
      {
        path: 'variants',
        populate: ['color', ['size']],
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
        populate: {
          path: 'size_id',
        },
      },
    ]);
    return products;
  };

  static getOneProduct = async (req) => {
    const product = await Product.findById(req.params.id).populate([
      {
        path: 'variants',
        populate: ['color', ['size']],
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
        populate: {
          path: 'size_id',
        },
      },
    ]);
    return product;
  };

  static updateProduct = async (req) => {
    const {
      name,
      slug_name,
      description,
      regular_price,
      discount_price,
      images,
      tags,
      gender,
      variants,
      labels,
      isPublic,
      brand,
      product_colors,
      product_sizes,
    } = req.body;

    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found');
    }

    if (name && name !== product.name) {
      const existingName = await Product.findOne({ name });
      if (existingName) {
        throw new ApiError(StatusCodes.CONFLICT, 'This product name already exists');
      }
    }

    if (slug_name && slug_name !== product.slug_name) {
      const existingSlug = await Product.findOne({ slug_name });
      if (existingSlug) {
        throw new ApiError(StatusCodes.CONFLICT, 'This product slug already exists');
      }
    }

    if (variants) {
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
    }

    if (product_colors) {
      await Product_Color.deleteMany({ _id: { $in: product.product_colors } });
      const productColors = await Product_Color.create(product_colors);
      product.product_colors = productColors.map((color) => color._id);
    }

    if (product_sizes) {
      await Product_Size.deleteMany({ _id: { $in: product.product_sizes } });
      const productSizes = await Product_Size.create(product_sizes);
      product.product_sizes = productSizes.map((size) => size._id);
    }

    product.name = name || product.name;
    product.slug_name = slug_name || product.slug_name;
    product.description = description || product.description;
    product.regular_price = regular_price || product.regular_price;
    product.discount_price = discount_price || product.discount_price;
    product.images = images || product.images;
    product.tags = tags || product.tags;
    product.gender = gender || product.gender;
    product.labels = labels || product.labels;
    product.isPublic = isPublic !== undefined ? isPublic : product.isPublic;
    product.brand = brand || product.brand;

    await product.save();

    return await Product.findById(product._id);
  };

  static deleteProduct = async (req) => {
    const productId = req.params.id;

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found');
    }

    await Variant.deleteMany({ product_id: productId });

    await Product_Size.deleteMany({ _id: { $in: deletedProduct.product_sizes } });

    await Product_Color.deleteMany({ _id: { $in: deletedProduct.product_colors } });

    return deletedProduct;
  };
}
