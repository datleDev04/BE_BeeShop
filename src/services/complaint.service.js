import { Transformer } from '../utils/transformer.js';
import Order from '../models/Order.js';
import ApiError from '../utils/ApiError.js';
import { StatusCodes } from 'http-status-codes';
import { ORDER_STATUS } from '../utils/constants.js';
import Complaint, { COMPLAINT_STATUS } from '../models/Complaint.js';
import { createOrderLog } from '../utils/CreateOrderLog.js';
import { ORDER_LOG_TYPE, WRITE_LOG_BY } from '../models/Order_Log.js';

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
    await createOrderLog({
      order_id: order._id,
      type: ORDER_LOG_TYPE.UPDATE,
      user_id: userId,
      status: ORDER_STATUS.REQUEST_RETURN,
      write_by: WRITE_LOG_BY.CUSTOMER,
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
        message: 'Không thể thu hồi khiếu nại lúc này!',
      });
    }

    complaint.status = COMPLAINT_STATUS.WITHDRAWN;
    await complaint.save();

    const order = await Order.findByIdAndUpdate(complaint.order._id, {
      order_status: ORDER_STATUS.SUCCESS,
    });

    await createOrderLog({
      order_id: order._id,
      type: ORDER_LOG_TYPE.UPDATE,
      user_id: userId,
      status: ORDER_STATUS.SUCCESS,
      write_by: WRITE_LOG_BY.CUSTOMER,
    });

    return Transformer.transformObjectTypeSnakeToCamel(complaint);
  }

  static async updateComplaintStatusForAdmin(req, res) {
    const { id } = req.params;
    const { _id: userId } = req.user;
    const { status, reject_reason, admin_note } = req.body;

    const complaint = await Complaint.findById(id).populate('order');

    if (!complaint) {
      throw new ApiError(StatusCodes.NOT_FOUND, {
        message: 'Complaint not found!',
      });
    }

    const processComplaint = {
      [COMPLAINT_STATUS.RESOLVED]: async () => {
        const order = await Order.findByIdAndUpdate(complaint.order._id, {
          order_status: ORDER_STATUS.RETURNING,
        });
        await createOrderLog({
          order_id: order._id,
          type: ORDER_LOG_TYPE.UPDATE,
          user_id: userId,
          status: ORDER_STATUS.RETURNING,
          write_by: WRITE_LOG_BY.ADMIN,
        });
      },
      [COMPLAINT_STATUS.REJECTED]: async () => {
        const order = await Order.findByIdAndUpdate(complaint.order._id, {
          order_status: ORDER_STATUS.DENIED_RETURN,
        });
        await createOrderLog({
          order_id: order._id,
          type: ORDER_LOG_TYPE.UPDATE,
          user_id: userId,
          status: ORDER_STATUS.DENIED_RETURN,
          write_by: WRITE_LOG_BY.ADMIN,
        });
      },
      [COMPLAINT_STATUS.COMPENSATE]: async () => {
        const order = await Order.findByIdAndUpdate(complaint.order._id, {
          order_status: ORDER_STATUS.COMPENSATING,
        });
        await createOrderLog({
          order_id: order._id,
          type: ORDER_LOG_TYPE.UPDATE,
          user_id: userId,
          status: ORDER_STATUS.COMPENSATING,
          write_by: WRITE_LOG_BY.ADMIN,
        });
      },
    };

    if (processComplaint[status]) {
      await processComplaint[status]();
    }

    complaint.status = status;
    complaint.reject_reason = reject_reason;
    complaint.admin_note = admin_note;
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
