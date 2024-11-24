import { StatusCodes } from 'http-status-codes';
import Order from '../../../models/Order.js';
import Order_item from '../../../models/Order_item.js';
import Product from '../../../models/Product.js';
import Review from '../../../models/Review.js';
import Variant from '../../../models/Variant.js';
import { GET_MOST_ORDERS } from './query-builder/getMostOrders.js';
import { GET_MOST_PURCHASED_COLOR } from './query-builder/getMostPurchasedColor.js';
import { GET_MOST_PURCHASED_SIZE } from './query-builder/getMostPurchasedSize.js';
import ApiError from '../../../utils/ApiError.js';
import moment from 'moment';
import { ORDER_STATUS } from '../../../utils/constants.js';
import { GET_TOTAL_REVENUE } from './query-builder/getRevenue.js';

export const statsService = {
  getMostPurchasedSize: async () => {
    const orders = await Order_item.aggregate([...GET_MOST_PURCHASED_SIZE.getPopulateOptions()]);
    return orders;
  },
  getMostPurchasedColor: async () => {
    const orders = await Order_item.aggregate([...GET_MOST_PURCHASED_COLOR.getPopulateOptions()]);
    return orders;
  },
  getAlmostOutOfStock: async () => {
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
    const variants = await Variant.find({ stock: { $lte: 10 } }, ['_id', 'stock']);
    const products = await Product.find({ variants: { $in: variants.map((v) => v._id) } }).populate(
      populateOptions
    );
    return products;
  },
  getMostOrders: async () => {
    const orders = await Order.aggregate([...GET_MOST_ORDERS.getPopulateOptions()]);

    return orders;
  },

  getLatestReviewProduct: async () => {
    const latestReview = await Review.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user')
      .populate({
        path: 'order_item',
        populate: {
          path: 'product',
          model: 'Product',
        },
      });
    return latestReview;
  },

  getStatistics: async (req) => {
    const { type } = req.query;
    const results = await GET_TOTAL_REVENUE.getTotalRevenueOptions(type);
    return results;
  },
};
