import PayOS from '@payos/node';
import ApiError from './ApiError.js';
import { StatusCodes } from 'http-status-codes';
import OrderItem from '../models/Order_item.js';
import Order from '../models/Order.js';
import CartService from '../services/cart.service.js';
import dotenv from 'dotenv';
import { PAYMENT_STATUS } from './constants.js';

dotenv.config();

const payOS = new PayOS(
  process.env.PAYOS_CLIENT_ID,
  process.env.PAYOS_API_KEY,
  process.env.PAYOS_CHECKSUM_KEY
);

export async function createPayosPayment(populatedOrder) {
  const totalPrice = populatedOrder.total_price;

  const payOsOptions = {
    orderCode: Number(String(new Date().getTime()).slice(-6)),
    amount: totalPrice,
    description: 'Thanh toan don hang',
    items: populatedOrder.items.map((item) => ({
      name: item.product.name,
      quantity: item.quantity,
      price: item.price,
    })),
    cancelUrl: `${process.env.SERVER_BASE_URL}/api/client/payos?cancel=1&order_id=${populatedOrder._id}`,
    returnUrl: `${process.env.SERVER_BASE_URL}/api/client/payos?success=1&order_id=${populatedOrder._id}`,
  };

  try {
    const paymentLinkRes = await payOS.createPaymentLink(payOsOptions);
    return paymentLinkRes.checkoutUrl;
  } catch (error) {
    console.error('Error creating PayOS payment link:', error);
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Error creating PayOS payment link');
  }
}

export async function createPayosReturnUrl(req) {
  const { cancel, success, order_id } = req.query;
  let redirectUrl = '';
  const order = await Order.findById(order_id);
  if (!order) {
    redirectUrl = `${process.env.CLIENT_BASE_URL}/payment?cancel=1`;
  }

  if (cancel === '1' || cancel === 'true') {
    redirectUrl = `${process.env.CLIENT_BASE_URL}/payment?cancel=1`;
    const orderItems = order?.items;
    await OrderItem.deleteMany({ _id: { $in: orderItems } });
    await Order.findByIdAndDelete({ _id: order._id });
  }

  if (success === '1') {
    redirectUrl = `${process.env.CLIENT_BASE_URL}/payment?success=1&order_id=${order._id}`;
    order.payment_status = PAYMENT_STATUS.COMPLETED;
    await CartService.deleteAllCartItem({ user: { _id: order.user } });
    await order.save();
  }
  return redirectUrl;
}

export default payOS;
