import { StatusCodes } from 'http-status-codes';
import Order from '../../../models/Order.js';
import ApiError from '../../../utils/ApiError.js';
import { ORDER_STATUS, STATUS } from '../../../utils/constants.js';
import Order_item from '../../../models/Order_item.js';
import Review from '../../../models/Review.js';
import { Transformer } from '../../../utils/transformer.js';
import Product from '../../../models/Product.js';
import { GET_PRODUCT_REVIEW } from '../product/query-builder/getProductReviews.js';

export const reviewService = {
  addReview: async (req) => {
    const { orderItemId, content, rates, images, reply } = req.body;

    if (reply) {
      if (!req.user.isSystemAccount) {
        throw new ApiError(StatusCodes.BAD_REQUEST, {
          reply: `${reply}: You do not have access to reply to this review`,
        });
      }

      const replyReview = await Review.findById(reply);
      if (!replyReview) {
        throw new ApiError(StatusCodes.BAD_REQUEST, {
          reply: `${reply}: Reply no found`,
        });
      }

      if (replyReview.reply) {
        throw new ApiError(StatusCodes.BAD_REQUEST, {
          reply: `${reply}: This review cannot be replied to`,
        });
      }

      if (replyReview.status === STATUS.INACTIVE) {
        throw new ApiError(StatusCodes.BAD_REQUEST, {
          reply: `${reply}: This review has been disabled`,
        });
      }
    }

    const order = await Order.findOne({
      user: req.user._id,
      order_status: ORDER_STATUS.SUCCESS,
      items: orderItemId,
    }).populate(['items']);

    if (!order)
      throw new ApiError(StatusCodes.BAD_REQUEST, {
        message: 'Order does not exist or has not been completed',
      });

    const orderItem = await Order_item.findOne({ _id: orderItemId, has_feedback: false }).populate(
      'product'
    );

    if (!orderItem)
      throw new ApiError(StatusCodes.BAD_REQUEST, {
        message: 'This item has been reviewed',
      });

    const review = await Review.create({
      user: req.user._id,
      order_item: orderItem,
      content,
      rates,
      images,
      reply,
      order: order._id,
    });

    orderItem.has_feedback = true;
    await orderItem.save();

    const currentProduct = await Product.findById(orderItem.product);

    const existingReviews = await Review.aggregate([
      ...GET_PRODUCT_REVIEW.getPopulateOptions(),
      {
        $match: {
          status: STATUS.ACTIVE,
          'order_item.product': orderItem.product._id,
        },
      },
    ]);

    // Calculate new total reviews and average rating
    const totalReviews = existingReviews.length;
    const averageRating =
      existingReviews.reduce((sum, r) => sum + r.rates, 0) / existingReviews.length;

    currentProduct.total_reviews = totalReviews;
    currentProduct.average_rating = averageRating.toFixed(1);
    await currentProduct.save();

    const newReview = await Review.findById(review._id).populate([
      { path: 'order_item', populate: { path: 'product' } },
    ]);

    return newReview;
  },

  deleteReview: async (req) => {
    const { id } = req.params;

    const review = await Review.findOneAndUpdate(
      {
        _id: id,
        user: req.user._id,
        status: STATUS.ACTIVE,
      },
      { status: STATUS.INACTIVE }
    );

    if (!review) {
      throw new ApiError(StatusCodes.BAD_REQUEST, {
        message: 'Review not found or unauthorized to delete',
      });
    }
    return review;
  },

  getUserReviews: async (req) => {
    const reviews = await Review.find({ user: req.user._id })
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

    const transformedReviews = reviews.map((review) =>
      Transformer.transformOrderObjectTypeSnakeToCamel(review.toObject())
    );
    return transformedReviews;
  },
  deleteReviewByAdmin: async (req) => {
    const { id } = req.params;

    const review = await Review.findOneAndUpdate(
      {
        _id: id,
        status: STATUS.ACTIVE,
      },
      { status: STATUS.INACTIVE }
    );

    if (!review) {
      throw new ApiError(StatusCodes.BAD_REQUEST, {
        message: 'Review not found or unauthorized to delete',
      });
    }
    return review;
  },
};
