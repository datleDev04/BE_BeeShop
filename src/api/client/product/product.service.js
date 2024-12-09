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
import { getSortOptions } from '../../helpers/api-handler.js';
import { GET_ALL_PRODUCT } from './query-builder/getAllProducts.js';
import { GET_PRODUCT_REVIEW } from './query-builder/getProductReviews.js';

// Initials
const { ObjectId } = mongoose.Types;

export const productService = {
  getAllProducts: async (req) => {
    const {
      _page = 1,
      _limit = 10,
      orderBy = 'createdAt',
      sort = 'DESC',
      ...filter
    } = req.query;

    const result = await Product.aggregate([
      ...GET_ALL_PRODUCT.getPopulateOptions(),
      { $match: GET_ALL_PRODUCT.getQueries(filter) },
      { $sort: getSortOptions(orderBy, sort) },
      {
        $facet: {
          products: [{ $skip: (_page - 1) * _limit }, { $limit: Number(_limit) }],
          count: [{ $count: 'id' }],
        },
      },
    ]);

    const { products, count } = result.at(0);

    return { products, totalDocs: count[0].id };
  },
  getProductBySlug: async (req) => {
    const { slug } = req.params;
    const product = await Product.findOne({ slug, status: STATUS.ACTIVE }).populate([
      { path: 'variants', populate: ['color', 'size'] },
      { path: 'tags' },
      { path: 'gender' },
      { path: 'labels' },
      { path: 'brand' },
      { path: 'product_colors', populate: { path: 'color_id' } },
      { path: 'product_sizes' },
      { path: 'product_type' },
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

    const reviewIds = reviews.map((review) => review._id);

    const populateReview = await Review.find({
      _id: { $in: reviewIds },
    })
      .populate([
        {
          path: 'order_item',
          populate: { path: 'product' },
        },
        {
          path: 'user',
          select: '-password -resetPasswordToken -verificationTokenExpiresAt -roles',
        },
      ])
      .sort({ createdAt: -1 });

    return populateReview;
  },
};
