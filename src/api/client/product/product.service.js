import Product from '../../../models/Product.js';
import { queryBuilder } from './helper.js';
import { getSortOptions } from '../../helpers/api-handler.js';
import _ from 'lodash';

export const productService = {
  getAllProducts: async (req) => {
    const {
      _page = 1,
      _limit = 10,
      orderBy = 'createdAt',
      sort = 'DESC',
      ...filter
    } = req.query

    const products = await Product.aggregate([
      {
        $lookup: {
          from: "Variants",
          localField: "variants",
          foreignField: "_id",
          as: "variants",
        },
      },
      {
        $match: queryBuilder(filter),
      },
      { $limit: Number(_limit) },
      { $skip: (_page - 1) * _limit },
      { $sort: getSortOptions(orderBy, sort) },
    ]);

    return products;
  },
};
