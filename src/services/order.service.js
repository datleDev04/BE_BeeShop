import Order from '../models/Order.js';
import { checkRecordByField } from '../utils/CheckRecord.js';
import { Transformer } from '../utils/transformer.js';
import { getFilterOptions, getPaginationOptions } from '../utils/pagination.js';
import OrderItem from '../models/Order_item.js';
import OrderItemService from './order_item.service.js';
import Variant from '../models/Variant.js';
import ApiError from '../utils/ApiError.js';
import { StatusCodes } from 'http-status-codes';
import { ORDER_STATUS, PAYMENT_STATUS, PAYMENT_TYPE } from '../utils/constants.js';
import { createPayosPayment } from '../utils/PayOs.js';
import { createVnpayPayment } from '../utils/VnPay.js';
import User from '../models/User.js';
import Cart from '../models/Cart.js';
import CartItem from '../models/Cart_Item.js';
import CartService from './cart.service.js';

const orderPopulateOptions = [
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
    path: 'shipping_method',
  },
];

export default class OrderService {
  static createNewOrder = async (req, res) => {
    const { _id: userId, email } = req.user;
    const {
      items,
      total_price,
      regular_total_price,
      phone_number,
      shipping_address,
      shipping_method,
      payment_type,
      voucher,
      user_email,
    } = req.body;

    // Check if there's enough stock for each item
    await Promise.all(
      items.map(async (item) => {
        const variant = await Variant.findById(item.variant_id);
        if (variant.stock < item.quantity) {
          throw new ApiError(StatusCodes.BAD_REQUEST, 'Insufficient stock for the variant');
        }
      })
    );

    // Create order items
    const orderItems = await Promise.all(
      items.map((item) => OrderItemService.createOrderItem(item))
    );
    const orderItemIds = orderItems.map((item) => item._id);

    // Create the order
    const newOrder = await Order.create({
      user: userId,
      items: orderItemIds,
      total_price,
      phone_number,
      regular_total_price,
      shipping_address,
      order_status: ORDER_STATUS.PENDING,
      payment_status: PAYMENT_STATUS.PENDING,
      payment_type,
      voucher,
      user_email: user_email || email,
      shipping_method,
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

    await CartService.deleteAllCartItem(req);

    return { checkoutUrl };
  };

  static rePayment = async (req) => {
    await checkRecordByField(Order, '_id', req.params.id, true);

    const populatedOrder = await Order.findById(req.params.id).populate({
      path: 'items',
      populate: {
        path: 'product',
        select: 'name',
      },
    });

    if (populatedOrder.payment_status === PAYMENT_STATUS.COMPLETED) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'This order payment completed!');
    }

    await Promise.all(
      populatedOrder.items.map(async (item) => {
        const variant = await Variant.findById(item.variant_id);
        if (variant.stock < item.quantity) {
          throw new ApiError(StatusCodes.BAD_REQUEST, 'Insufficient stock for the variant');
        }
      })
    );

    // Generate checkout URL based on payment type
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
      checkoutUrl: process.env.CLIENT_BASE_URL,
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

  static getOrderByUser = async (req) => {
    const { id: userId } = req.params;

    await checkRecordByField(User, '_id', userId, true);

    const options = getPaginationOptions(req);
    const filter = getFilterOptions(req, ['user_email']);

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
    return Transformer.transformObjectTypeSnakeToCamel(order.toObject());
  };

  static updateOrderById = async (req) => {
    const {
      phone_number,
      user_email,
      shipping_address,
      order_status,
      payment_status,
      tracking_number,
    } = req.body;
    const { id } = req.params;

    await checkRecordByField(Order, '_id', req.params.id, true);

    const order = await Order.findById(id);
    if (phone_number) order.phone_number = phone_number;
    if (shipping_address) order.shipping_address = shipping_address;
    if (user_email) order.user_email = user_email;
    if (order_status) order.order_status = order_status;
    if (payment_status) order.payment_status = payment_status;
    if (tracking_number) order.tracking_number = tracking_number;

    await order.save();

    const updatedOrder = await Order.findById(id).populate(orderPopulateOptions);

    return Transformer.transformObjectTypeSnakeToCamel(updatedOrder.toObject());
  };

  static deleteOrderById = async (req) => {
    await checkRecordByField(Order, '_id', req.params.id, true);
    const order = await Order.findById(req.params.id);

    // Delete associated order items
    await OrderItem.deleteMany({ _id: { $in: order.items } });

    return await Order.findByIdAndDelete(req.params.id);
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

    // Shipping method filter
    if (req.query.shipping_method) {
      filter.shipping_method = req.query.shipping_method;
    }

    // Phone number filter
    if (req.query.phone_number) {
      filter.phone_number = { $regex: req.query.phone_number, $options: 'i' };
    }

    return filter;
  }
}
