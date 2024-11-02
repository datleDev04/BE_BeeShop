import Product from '../../../models/Product.js';
import { populateOptions, queryBuilder } from './helper.js';
import { getSortOptions } from '../../helpers/api-handler.js';
import _ from 'lodash';
import { STATUS } from '../../../utils/constants.js';
import ApiError from '../../../utils/ApiError.js';
import { StatusCodes } from 'http-status-codes';

export const productService = {
  getAllProducts: async (req) => {
    const { _page = 1, _limit = 10, orderBy = 'createdAt', sort = 'DESC', ...filter } = req.query;

    const products = await Product.aggregate([
      populateOptions,
      { $match: queryBuilder(filter) },
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
};
