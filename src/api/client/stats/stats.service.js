import { StatusCodes } from 'http-status-codes';
import Order from '../../../models/Order.js';
import Order_item from '../../../models/Order_item.js';
import Product from '../../../models/Product.js';
import Review from '../../../models/Review.js';
import Variant from '../../../models/Variant.js';
import ApiError from '../../../utils/ApiError.js';
import { ORDER_STATUS } from '../../../utils/constants.js';
import { GET_MOST_ORDERS } from './query-builder/getMostOrders.js';
import { GET_MOST_PURCHASED_COLOR } from './query-builder/getMostPurchasedColor.js';
import { GET_MOST_PURCHASED_SIZE } from './query-builder/getMostPurchasedSize.js';

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

  getOrderCountWithStatus: async () => {
    try {
      const orderCounts = await Order.aggregate([
        {
          $group: {
            _id: '$order_status',
            count: { $sum: 1 },
          },
        },
      ]);

      const result = Object.values(ORDER_STATUS).reduce((acc, status) => {
        acc[status] = 0;
        return acc;
      }, {});

      orderCounts.forEach(({ _id, count }) => {
        if (_id in result) {
          result[_id] = count;
        }
      });

      return result;
    } catch (error) {
      throw new ApiError(StatusCodes.BAD_REQUEST, {
        message: 'Somethings went wrong!',
      });
    }
  },
};
