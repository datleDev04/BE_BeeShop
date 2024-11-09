// Libs import
import _ from 'lodash';
import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';

// Models import
import Product from '../../../models/Product.js';
import Review from '../../../models/Review.js';

// Utils import
import { STATUS } from '../../../utils/constants.js';
import ApiError from '../../../utils/ApiError.js';
import { filterObjectKeys } from '../../helpers/object.js';
import { getSortOptions } from '../../helpers/api-handler.js';
import { ORDER_ITEM_LOOKUP, ROLE_LOOKUP, USER_LOOKUP } from '../../lookup/index.js';
import { GET_ALL_PRODUCT } from './query-builder/getAllProducts.js';
import { GET_PRODUCT_REVIEW } from './query-builder/getProductReviews.js';

// Initials
const { ObjectId } = mongoose.Types;

export const productService = {
  getAllProducts: async (req) => {
    const { _page = 1, _limit = 10, orderBy = 'createdAt', sort = 'DESC', ...filter } = req.query;

    const products = await Product.aggregate([
      ...GET_ALL_PRODUCT.getPopulateOptions(),
      { $match: GET_ALL_PRODUCT.getQueries(filter) },
      { $limit: Number(_limit) },
      { $skip: (_page - 1) * _limit },
      { $sort: getSortOptions(orderBy, sort) },
    ]);

    return products;
  },
  getProductBySlug: async (req) => {
    const { slug } = req.params;
    const product = await Product.findOne({ slug, status: STATUS.ACTIVE }).populate([
      'tags',
      'gender',
      { path: 'variants', populate: ['color', 'size'] },
      'labels',
      'brand',
      'product_colors',
      'product_sizes',
      'product_type',
    ]);
    if (!product) {
      throw new ApiError(StatusCodes.NOT_FOUND, { message: 'Product not found' });
    }
    return product;
  },
  getProductReviews: async (req) => {
    const { productId } = req.params;

    if (!ObjectId.isValid(productId)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, { params: 'Product id is invalid' });
    }
    const reviews = await Review.aggregate([
      ...GET_PRODUCT_REVIEW.getPopulateOptions(),
      {
        $match: {
          status: STATUS.ACTIVE,
          'order_item.product': ObjectId.createFromHexString(productId),
        },
      },
    ]);
    if (!reviews) {
      throw new ApiError(StatusCodes.NOT_FOUND, { message: 'Product not found' });
    }
    return reviews;
  },
};
