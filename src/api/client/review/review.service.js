import { StatusCodes } from 'http-status-codes';
import Order from '../../../models/Order.js';
import ApiError from '../../../utils/ApiError.js';
import { ORDER_STATUS, STATUS } from '../../../utils/constants.js';
import Order_item from '../../../models/Order_item.js';
import Review from '../../../models/Review.js';

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

    const orderItem = await Order_item.findOne({ _id: orderItemId, has_feedback: false });

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

    return review;
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
    const reviews = await Review.find({ user: req.user._id }).populate([
      { path: 'order_item', populate: { path: 'product' } },
    ]);
    return reviews;
  },
};
