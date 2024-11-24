import Order from '../../../models/Order.js';
import Order_item from '../../../models/Order_item.js';
import Product from '../../../models/Product.js';
import Review from '../../../models/Review.js';
import Variant from '../../../models/Variant.js';
import { PAYMENT_STATUS } from '../../../utils/constants.js';
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

  getRevenue: async (req) => {
    const { startDate, endDate, groupBy } = req.query;

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const groupFormat =
      groupBy === 'month'
        ? { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }
        : groupBy === 'year'
        ? { year: { $year: '$createdAt' } }
        : { year: { $year: '$createdAt' }, month: { $month: '$createdAt' }, day: { $dayOfMonth: '$createdAt' } };

    const revenueData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          payment_status: PAYMENT_STATUS.COMPLETED,
        },
      },
      {
        $group: {
          _id: groupFormat,
          totalRevenue: { $sum: '$total_price' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    ]);
    return revenueData
  }
};
