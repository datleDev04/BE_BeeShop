import Order from '../../../models/Order.js';
import Order_item from '../../../models/Order_item.js';
import Product from '../../../models/Product.js';
import Review from '../../../models/Review.js';
import Variant from '../../../models/Variant.js';
import { GET_MOST_ORDERS } from './query-builder/getMostOrders.js';
import { GET_MOST_PURCHASED_COLOR } from './query-builder/getMostPurchasedColor.js';
import { GET_MOST_PURCHASED_SIZE } from './query-builder/getMostPurchasedSize.js';
import { ORDER_STATUS } from '../../../utils/constants.js';
import { getDateRangeWithDateFns } from '../../helpers/date.js';

export const statsService = {
  getMostPurchasedSize: async (req) => {
    const { start, end } = getDateRangeWithDateFns(req.query.period || 'all_time');

    const successOrderItemIds = await Order.distinct('items', {
      order_status: ORDER_STATUS.SUCCESS,
      finished_date: { $gte: start, $lte: end },
    }).populate([{ path: 'items' }]);

    const orderItems = Order_item.aggregate([
      {
        $match: {
          _id: { $in: successOrderItemIds },
        },
      },
      ...GET_MOST_PURCHASED_SIZE.getPopulateOptions(),
    ]);
    return orderItems;
  },
  getMostPurchasedColor: async (req) => {
    const { start, end } = getDateRangeWithDateFns(req.query.period || 'all_time');

    const successOrderItemIds = await Order.distinct('items', {
      order_status: ORDER_STATUS.SUCCESS,
      finished_date: { $gte: start, $lte: end },
    }).populate([{ path: 'items' }]);

    const orderItems = Order_item.aggregate([
      {
        $match: {
          _id: { $in: successOrderItemIds },
        },
      },
      ...GET_MOST_PURCHASED_COLOR.getPopulateOptions(),
    ]);
    return orderItems;
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
    const orders = await Order.aggregate([...GET_MOST_ORDERS.getPopulateOptions(), { $limit: 10 }]);

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
};
