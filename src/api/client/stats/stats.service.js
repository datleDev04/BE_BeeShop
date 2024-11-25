import { StatusCodes } from 'http-status-codes';
import Order from '../../../models/Order.js';
import Order_item from '../../../models/Order_item.js';
import Product from '../../../models/Product.js';
import Review from '../../../models/Review.js';
import Variant from '../../../models/Variant.js';
import ApiError from '../../../utils/ApiError.js';
import { ORDER_STATUS, STATUS } from '../../../utils/constants.js';
import { GET_MOST_ORDERS } from './query-builder/getMostOrders.js';
import { GET_MOST_PURCHASED_COLOR } from './query-builder/getMostPurchasedColor.js';
import { GET_MOST_PURCHASED_SIZE } from './query-builder/getMostPurchasedSize.js';
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

  getLatestReviewProduct: async (req) => {
    const { name } = req.query;
    try {
      if (name) {
        const latestReview = await Review.aggregate([
          {
            $lookup: {
              from: 'Order_Items',
              localField: 'order_item',
              foreignField: '_id',
              as: 'orderItem',
            },
          },
          {
            $unwind: '$orderItem',
          },
          {
            $lookup: {
              from: 'Products',
              localField: 'orderItem.product',
              foreignField: '_id',
              as: 'product',
            },
          },
          {
            $unwind: '$product',
          },
          {
            $match: {
              'product.name': new RegExp(name, 'i'),
              status: STATUS.ACTIVE,
            },
          },
          {
            $sort: {
              createdAt: -1,
            },
          },
          {
            $limit: 10,
          },
          {
            $lookup: {
              from: 'Users',
              localField: 'user',
              foreignField: '_id',
              as: 'user',
            },
          },
          {
            $unwind: '$user',
          },
          {
            $project: {
              content: 1,
              images: 1,
              rates: 1,
              user: {
                _id: 1,
                full_name: 1,
                email: 1,
                avatar_url: 1,
                status: 1,
                createdAt: 1,
                updatedAt: 1,
                gender: 1,
                phone: 1,
              },
              order_item: {
                _id: '$orderItem._id',
                product: {
                  name: '$product.name',
                  thumbnail: '$product.thumbnail',
                },
                quantity: '$orderItem.quantity',
                price: '$orderItem.price',
              },
              reply: 1,
              status: 1,
              createdAt: 1,
              updatedAt: 1,
              product: '$product.name',
            },
          },
        ]);
        return latestReview;
      }
      const latestReview = await Review.find({ status: STATUS.ACTIVE })
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
    } catch (error) {
      console.log('err', error);
    }
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

  getStatistics: async (req) => {
    const { type } = req.query;
    const results = await GET_TOTAL_REVENUE.getTotalRevenueOptions(type);
    return results;
  },
};
