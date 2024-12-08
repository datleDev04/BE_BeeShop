import Order from '../models/Order.js';
import { checkRecordByField } from '../utils/CheckRecord.js';
import { Transformer } from '../utils/transformer.js';
import { getFilterOptions, getPaginationOptions } from '../utils/pagination.js';
import OrderItem from '../models/Order_item.js';
import OrderItemService from './order_item.service.js';
import Variant from '../models/Variant.js';
import ApiError from '../utils/ApiError.js';
import { StatusCodes } from 'http-status-codes';
import {
  ORDER_STATUS,
  ORDER_STATUS_CONVERT,
  PAYMENT_STATUS,
  PAYMENT_TYPE,
  STATUS,
} from '../utils/constants.js';
import { createPayosPayment, createPayosReturnUrl } from '../utils/PayOs.js';
import { createVnpayPayment, createVnpayReturnUrl } from '../utils/VnPay.js';
import User from '../models/User.js';
import Cart from '../models/Cart.js';
import CartItem from '../models/Cart_Item.js';
import cron from 'node-cron';
import { generateOrderUniqueID } from '../utils/generateOrderIds.js';
import { transporter } from '../utils/mails.js';
import { getChangeOrderStatusTemplate } from '../mail/emailTemplate.js';
import Voucher from '../models/Voucher.js';
import { createOrderLog } from '../utils/CreateOrderLog.js';
import { ORDER_LOG_TYPE, WRITE_LOG_BY } from '../models/Order_Log.js';

export const orderPopulateOptions = [
  {
    path: 'user',
    select: '-password -resetPasswordToken -verificationTokenExpiresAt -roles',
  },
  {
    path: 'items',
    populate: [
      {
        path: 'product',
      },
      {
        path: 'variant',
        populate: [
          {
            path: 'size',
          },
          {
            path: 'color',
          },
        ],
      },
    ],
  },
  {
    path: 'voucher',
  },
  {
    path: 'complaint',
  },
];

cron.schedule('0 0 * * *', async () => {
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  try {
    const result = await Order.updateMany(
      {
        order_status: {
          $in: [ORDER_STATUS.DELIVERED, ORDER_STATUS.COMPENSATED, ORDER_STATUS.DENIED_RETURN],
        },
        delivered_date: { $lte: threeDaysAgo },
      },
      { $set: { order_status: ORDER_STATUS.SUCCESS } }
    );

    console.log(`Updated ${result.modifiedCount} orders to SUCCESS status`);
  } catch (error) {
    console.error('Cron job update order status failed:', error);
    throw new ApiError(500, 'Cron job update order status failed');
  }
});

// chạy hàm này sau mỗi 30 phút, tìm tất cả các đơn hàng tạo lớn hơn 1 ngày mà có trạng thái đơn hàng là pending hoặc failed
cron.schedule('*/30 * * * *', async () => {
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    await Order.updateMany(
      {
        createdAt: { $lt: oneDayAgo },
        payment_status: {
          $in: [PAYMENT_STATUS.PENDING, PAYMENT_STATUS.FAILED],
        },
        order_status: {
          $ne: ORDER_STATUS.CANCELLED,
        },
      },
      {
        $set: { order_status: ORDER_STATUS.CANCELLED },
      }
    );
    console.log('update pending ok');
  } catch (error) {
    throw new ApiError(500, {
      message: 'Error in cancel pending payment orders cron job',
    });
  }
});

export default class OrderService {
  static createNewOrder = async (req, res) => {
    const { _id: userId, email } = req.user;
    const {
      items,
      regular_total_price,
      phone_number,
      shipping_address,
      payment_type,
      voucher,
      user_email,
      user_name,
      shipping_fee,
    } = req.body;

    const discountPrice = await this.calculateDiscount(voucher, regular_total_price);

    await Promise.all(
      items.map(async (item) => {
        const variant = await Variant.findById(item.variant_id);
        if (variant.stock < item.quantity) {
          throw new ApiError(StatusCodes.BAD_REQUEST, { message: 'Sản phẩm tạm thời hết hàng!' });
        }
      })
    );

    // Create order items
    const orderItems = await Promise.all(
      items.map((item) => OrderItemService.createOrderItem(item))
    );
    const orderItemIds = orderItems.map((item) => item._id);

    const unique_id = generateOrderUniqueID();

    // Create the order
    const newOrder = await Order.create({
      user: userId,
      items: orderItemIds,
      total_price: regular_total_price - discountPrice + shipping_fee,
      discount_price: discountPrice,
      phone_number,
      regular_total_price,
      shipping_address,
      order_status: ORDER_STATUS.PENDING,
      payment_status: PAYMENT_STATUS.PENDING,
      payment_type,
      voucher,
      user_email: user_email || email,
      user_name,
      shipping_fee,
      unique_id,
    });

    // Populate the order with items and products
    const populatedOrder = await Order.findById(newOrder._id).populate({
      path: 'items',
      populate: {
        path: 'product',
        select: 'name',
      },
    });

    // Generate checkout URL based on payment type
    let checkoutUrl =
      payment_type === PAYMENT_TYPE.VNPAY
        ? await createVnpayPayment(req, populatedOrder)
        : await createPayosPayment(populatedOrder);

    return { checkoutUrl };
  };

  static calculateDiscount = async (voucher, price) => {
    if (!voucher) return 0;

    const currentVoucher = await Voucher.findById(voucher);

    if (!currentVoucher)
      throw new ApiError(StatusCodes.BAD_REQUEST, {
        message: 'Voucher không tồn tại hoặc hết hạn',
      });
    if (currentVoucher.max_usage <= 0)
      throw new ApiError(StatusCodes.BAD_REQUEST, { message: 'Voucher đã không còn hạn sử dụng!' });
    if (currentVoucher.status === STATUS.INACTIVE)
      throw new ApiError(StatusCodes.BAD_REQUEST, { message: 'Voucher đã không khả dụng!' });
    if (currentVoucher.end_date < new Date())
      throw new ApiError(StatusCodes.BAD_REQUEST, { message: 'Voucher hết hạn sử dụng!' });
    if (currentVoucher.minimum_order_price > price)
      throw new ApiError(StatusCodes.BAD_REQUEST, { message: 'Voucher không hợp lệ' });

    if (currentVoucher.discount_types === 'percentage') {
      const percentageDiscount = (price * currentVoucher.discount) / 100;
      return currentVoucher.max_reduce
        ? Math.min(percentageDiscount, currentVoucher.max_reduce)
        : percentageDiscount;
    }

    return currentVoucher.discount;
  };

  static rePayment = async (req) => {
    await checkRecordByField(Order, '_id', req.params.id, true);

    const populatedOrder = await Order.findById(req.params.id).populate(orderPopulateOptions);

    if (populatedOrder.payment_status === PAYMENT_STATUS.COMPLETED) {
      throw new ApiError(StatusCodes.BAD_REQUEST, { message: 'This order payment completed!' });
    }

    await Promise.all(
      populatedOrder.items.map(async (item) => {
        const variant = await Variant.findById(item.variant_id);
        if (variant?.stock < item?.quantity) {
          throw new ApiError(StatusCodes.BAD_REQUEST, {
            message: 'Sản phẩm hết hàng, không thể tạo đơn hàng!',
          });
        }
      })
    );

    populatedOrder.payment_status = PAYMENT_STATUS.PENDING;
    populatedOrder.order_status = ORDER_STATUS.PENDING;

    await populatedOrder.save();

    let checkoutUrl =
      populatedOrder.payment_type === PAYMENT_TYPE.VNPAY
        ? await createVnpayPayment(req, populatedOrder)
        : await createPayosPayment(populatedOrder);
    return { checkoutUrl };
  };

  static reOrder = async (req) => {
    const { id } = req.params;
    const userId = req.user._id;

    await checkRecordByField(Order, '_id', id, true);

    const populatedOrder = await Order.findById(id).populate({
      path: 'items',
      populate: [
        {
          path: 'product',
          select: 'name',
        },
        {
          path: 'variant',
          select: 'stock',
        },
      ],
    });

    const cartItems = await Promise.all(
      populatedOrder.items.map(async (item) => {
        if (item.quantity > item.variant.stock) {
          throw new ApiError(StatusCodes.BAD_REQUEST, 'Insufficient stock for the variant');
        }
        return {
          product: item.product._id.toString(),
          variant: item.variant._id.toString(),
          quantity: item.quantity,
        };
      })
    );

    // Find or create user's cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await Cart.create({ user: userId, cart_items: [] });
    }

    const createCartItems = await CartItem.insertMany(cartItems);

    // Add items to the cart
    cart.cart_items.push(...createCartItems.map((item) => item._id));

    await cart.save();

    return {
      checkoutUrl: `${process.env.CLIENT_BASE_URL}/cart`,
    };
  };

  static getAllOrders = async (req) => {
    const options = getPaginationOptions(req);
    const filter = this.getAdvancedFilterOptions(req);

    const paginatedOrders = await Order.paginate(filter, {
      ...options,
      populate: orderPopulateOptions,
    });

    const { docs, ...otherFields } = paginatedOrders;

    const transformedOrders = docs.map((order) =>
      Transformer.transformOrderObjectTypeSnakeToCamel(order.toObject())
    );

    const others = {
      ...otherFields,
    };

    return {
      metaData: Transformer.removeDeletedField(transformedOrders),
      others,
    };
  };

  static getOrderByUser = async (req) => {
    const userId = req.user._id;

    await checkRecordByField(User, '_id', userId, true);

    const options = getPaginationOptions(req);
    const filter = this.getAdvancedFilterOptions(req);

    const query = { user: userId, ...filter };

    const paginatedOrders = await Order.paginate(query, {
      ...options,
      populate: orderPopulateOptions,
    });

    const { docs, ...otherFields } = paginatedOrders;

    const transformedOrders = docs.map((order) =>
      Transformer.transformObjectTypeSnakeToCamel(order.toObject())
    );

    const others = {
      ...otherFields,
    };

    return {
      metaData: Transformer.removeDeletedField(transformedOrders),
      others,
    };
  };

  static getOneOrder = async (req) => {
    await checkRecordByField(Order, '_id', req.params.id, true);

    const order = await Order.findById(req.params.id).populate(orderPopulateOptions);
    return Transformer.transformOrderObjectTypeSnakeToCamel(order.toObject());
  };

  static updateOrderById = async (req) => {
    const { phone_number, user_email, user_name, shipping_address, order_status } = req.body;
    const { id } = req.params;
    const { _id: userId } = req.user;

    await checkRecordByField(Order, '_id', req.params.id, true);

    const order = await Order.findById(id);

    if (phone_number) order.phone_number = phone_number;
    if (user_name) order.user_name = user_name;
    if (shipping_address) order.shipping_address = shipping_address;
    if (user_email) order.user_email = user_email;

    if (order_status) {
      // Kiểm tra trạng thái hợp lệ cho người dùng
      const allowedTransitions = {
        [ORDER_STATUS.PENDING]: [ORDER_STATUS.CANCELLED, ORDER_STATUS.PROCESSING],
        [ORDER_STATUS.PROCESSING]: [], // Không cho phép thay đổi trạng thái khi đang xử lý
        [ORDER_STATUS.DELEVERING]: [],
        [ORDER_STATUS.DELIVERED]: [ORDER_STATUS.REQUEST_RETURN, ORDER_STATUS.SUCCESS],
        [ORDER_STATUS.COMPENSATED]: [ORDER_STATUS.SUCCESS],
      };

      const currentStatus = order.order_status;

      // Kiểm tra nếu trạng thái hiện tại không cho phép chuyển sang trạng thái mong muốn
      if (
        !allowedTransitions[currentStatus] ||
        !allowedTransitions[currentStatus].includes(order_status)
      ) {
        throw new ApiError(409, {
          message: `Không thể chuyển trạng thái từ ${ORDER_STATUS_CONVERT[currentStatus]} sang ${ORDER_STATUS_CONVERT[order_status]}`,
        });
      }

      // Cập nhật trạng thái và ngày giao hàng
      order.order_status = order_status;

      switch (order_status) {
        case ORDER_STATUS.DELIVERED: {
          order.delivered_date = Date.now();
          break;
        }
        case ORDER_STATUS.COMPENSATED: {
          order.delivered_date = Date.now();
          break;
        }
        case ORDER_STATUS.SUCCESS: {
          order.finished_date = Date.now();
          break;
        }
      }

      const convertOrderStatus = ORDER_STATUS_CONVERT[order_status];

      await transporter.sendMail({
        from: 'Beemely Store 👻',
        to: req.user.email,
        subject: `Đơn hàng #${order.unique_id} đã được cập nhật`,
        html: getChangeOrderStatusTemplate(req.user.full_name, convertOrderStatus, order.unique_id),
      });

      await createOrderLog({
        order_id: order._id,
        type: ORDER_LOG_TYPE.UPDATE,
        user_id: userId,
        status: order_status,
        write_by: WRITE_LOG_BY.CUSTOMER,
      });
    }

    await order.save();

    const updatedOrder = await Order.findById(id).populate(orderPopulateOptions);

    return Transformer.transformOrderObjectTypeSnakeToCamel(updatedOrder.toObject());
  };

  static adminUpdateOrderStatus = async (req) => {
    const { order_status } = req.body;
    const { _id: userId } = req.user;

    if (
      order_status == ORDER_STATUS.REQUEST_RETURN ||
      order_status == ORDER_STATUS.SUCCESS ||
      order_status == ORDER_STATUS.CANCELLED
    ) {
      throw new ApiError(409, {
        message: 'Only user can change this type of status',
      });
    }
    const { id } = req.params;

    await checkRecordByField(Order, '_id', req.params.id, true);

    const order = await Order.findById(id);

    const currentStatus = order.order_status;

    // Kiểm tra trạng thái hợp lệ
    if (!this.validStatusTransitions[currentStatus].includes(order_status)) {
      throw new ApiError(400, {
        message: `Cannot change status from ${currentStatus} to ${order_status}`,
      });
    }

    // Cập nhật trạng thái của order
    order.order_status = order_status;
    const convertOrderStatus = ORDER_STATUS_CONVERT[order_status];
    await order.save();

    await transporter.sendMail({
      from: 'Beemely Store 👻',
      to: req.user.email,
      subject: `Đơn hàng #${order.unique_id} đã được cập nhật`,
      html: getChangeOrderStatusTemplate(req.user.full_name, convertOrderStatus, order.unique_id),
    });

    await createOrderLog({
      order_id: order._id,
      type: ORDER_LOG_TYPE.UPDATE,
      user_id: userId,
      status: order_status,
      write_by: WRITE_LOG_BY.ADMIN,
    });

    const updatedOrder = await Order.findById(id).populate(orderPopulateOptions);

    return Transformer.transformOrderObjectTypeSnakeToCamel(updatedOrder.toObject());
  };

  // Quy tắc chuyển trạng thái hợp lệ
  static validStatusTransitions = {
    [ORDER_STATUS.PENDING]: [ORDER_STATUS.PROCESSING, ORDER_STATUS.CANCELLED],
    [ORDER_STATUS.PROCESSING]: [ORDER_STATUS.DELEVERING, ORDER_STATUS.CANCELLED],
    [ORDER_STATUS.DELEVERING]: [ORDER_STATUS.DELIVERED, ORDER_STATUS.REQUEST_RETURN],
    [ORDER_STATUS.DELIVERED]: [ORDER_STATUS.SUCCESS, ORDER_STATUS.REQUEST_RETURN],
    [ORDER_STATUS.REQUEST_RETURN]: [ORDER_STATUS.RETURNING, ORDER_STATUS.DENIED_RETURN],
    [ORDER_STATUS.COMPENSATING]: [ORDER_STATUS.COMPENSATED],
    [ORDER_STATUS.RETURNING]: [ORDER_STATUS.RETURNED],
    // Các trạng thái cuối cùng không thể thay đổi
    [ORDER_STATUS.SUCCESS]: [],
    [ORDER_STATUS.CANCELLED]: [],
    [ORDER_STATUS.DENIED_RETURN]: [],
    [ORDER_STATUS.RETURNED]: [],
  };

  static deleteOrderById = async (req) => {
    await checkRecordByField(Order, '_id', req.params.id, true);
    const order = await Order.findById(req.params.id);

    // Delete associated order items
    await OrderItem.deleteMany({ _id: { $in: order.items } });

    return await Order.findByIdAndDelete(req.params.id);
  };

  static vnpayReturn = async (req, res) => {
    const redirectUrl = await createVnpayReturnUrl(req, res);
    return { redirectUrl };
  };

  static payosReturn = async (req, res) => {
    const redirectUrl = await createPayosReturnUrl(req);
    return { redirectUrl };
  };

  static getAdvancedFilterOptions(req) {
    const filter = {};

    // User email filter
    if (req.query.user_email) {
      filter.user_email = { $regex: req.query.user_email, $options: 'i' };
    }

    // Price range filter
    if (req.query.min_price || req.query.max_price) {
      filter.total_price = {};
      if (req.query.min_price) filter.total_price.$gte = Number(req.query.min_price);
      if (req.query.max_price) filter.total_price.$lte = Number(req.query.max_price);
    }

    // Payment status filter
    if (
      req.query.payment_status &&
      Object.values(PAYMENT_STATUS).includes(req.query.payment_status)
    ) {
      filter.payment_status = req.query.payment_status;
    }

    // Payment type filter
    if (req.query.payment_type && Object.values(PAYMENT_TYPE).includes(req.query.payment_type)) {
      filter.payment_type = req.query.payment_type;
    }

    // Order status filter
    if (req.query.order_status && Object.values(ORDER_STATUS).includes(req.query.order_status)) {
      filter.order_status = req.query.order_status;
    }

    // Date range filter
    if (req.query.start_date || req.query.end_date) {
      filter.createdAt = {};
      if (req.query.start_date) filter.createdAt.$gte = new Date(req.query.start_date);
      if (req.query.end_date) filter.createdAt.$lte = new Date(req.query.end_date);
    }

    // Phone number filter
    if (req.query.phone_number) {
      filter.phone_number = { $regex: req.query.phone_number, $options: 'i' };
    }

    return filter;
  }
}
