import { Transformer } from '../utils/transformer.js';
import Order from '../models/Order.js';
import ApiError from '../utils/ApiError.js';
import { StatusCodes } from 'http-status-codes';
import { ORDER_STATUS } from '../utils/constants.js';
import Complaint, { COMPLAINT_STATUS } from '../models/Complaint.js';

class ComplaintService {
  static async createComplaint(req) {
    const { orderId, reason, description, images } = req.body;
    const userId = req.user._id;

    const order = await Order.findOne({
      _id: orderId,
      user: userId,
    });

    if (!order) {
      throw new ApiError(StatusCodes.NOT_FOUND, {
        message: 'Order not found!',
      });
    }

    const existingComplaint = await Complaint.findOne({
      order: orderId,
      user: userId,
    });

    if (existingComplaint) {
      throw new ApiError(StatusCodes.BAD_REQUEST, {
        message: 'Bạn đã tạo khiếu nại với đơn hàng này rồi, vui lòng đợi xử lý từ phía người bán',
      });
    }

    if (order.order_status !== ORDER_STATUS.DELIVERED) {
      throw new ApiError(StatusCodes.BAD_REQUEST, {
        message: 'Cannot create complaint with current order status',
      });
    }

    const complaint = new Complaint({
      user: userId,
      order: orderId,
      reason,
      description,
      images: images || [],
    });

    await complaint.save();

    await Order.findByIdAndUpdate(orderId, {
      order_status: ORDER_STATUS.REQUEST_RETURN,
      complaint: complaint._id,
    });

    return Transformer.transformObjectTypeSnakeToCamel(complaint.toObject());
  }

  static async withdrawComplaint(req) {
    const { id } = req.params;
    const userId = req.user._id;

    const complaint = await Complaint.findOne({
      _id: id,
      user: userId,
      status: {
        $in: [COMPLAINT_STATUS.PENDING, COMPLAINT_STATUS.PROCESSING, COMPLAINT_STATUS.REJECTED],
      },
    }).populate('order');

    if (!complaint) {
      throw new ApiError(StatusCodes.NOT_FOUND, {
        message: 'Complaint not found!',
      });
    }

    complaint.status = COMPLAINT_STATUS.WITHDRAWN;
    await complaint.save();

    await Order.findByIdAndUpdate(complaint.order._id, {
      order_status: ORDER_STATUS.SUCCESS,
    });

    return Transformer.transformObjectTypeSnakeToCamel(complaint);
  }

  static async updateComplaintStatusForAdmin(req, res) {
    const { id } = req.params;
    const { status, reject_reason } = req.body;

    const complaint = await Complaint.findById(id).populate('order');

    if (!complaint) {
      throw new ApiError(StatusCodes.NOT_FOUND, {
        message: 'Complaint not found!',
      });
    }

    const processComplaint = {
      [COMPLAINT_STATUS.RESOLVED]: async () => {
        await Order.findByIdAndUpdate(complaint.order._id, {
          order_status: ORDER_STATUS.RETURNING,
        });
      },
      [COMPLAINT_STATUS.REJECTED]: async () => {
        await Order.findByIdAndUpdate(complaint.order._id, {
          order_status: ORDER_STATUS.DENIED_RETURN,
        });
      },
      [COMPLAINT_STATUS.COMPENSATE]: async () => {
        await Order.findByIdAndUpdate(complaint.order._id, {
          order_status: ORDER_STATUS.COMPENSATING,
        });
      },
    };

    if (processComplaint[status]) {
      await processComplaint[status]();
    }

    complaint.status = status;
    complaint.reject_reason = reject_reason;
    await complaint.save();

    return Transformer.transformObjectTypeSnakeToCamel(complaint);
  }

  static async getUserComplaints(req) {
    const userId = req.user._id;
    const complaints = await Complaint.find({ user: userId })
      .populate('order')
      .sort({ createdAt: -1 });

    const metaData = complaints.map((comp) => {
      const compObj = comp.toObject();
      return Transformer.transformObjectTypeSnakeToCamel(compObj);
    });
    return { metaData };
  }

  static async getComplaintDetails(req) {
    const { id } = req.params;

    const complaint = await Complaint.findOne({
      _id: id,
    }).populate('order');

    if (!complaint) {
      throw new ApiError(StatusCodes.NOT_FOUND, {
        message: 'Complaint not found!',
      });
    }
    return Transformer.transformObjectTypeSnakeToCamel(complaint);
  }
}

export default ComplaintService;
