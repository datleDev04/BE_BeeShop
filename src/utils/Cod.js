import PayOS from '@payos/node';
import ApiError from './ApiError.js';
import { StatusCodes } from 'http-status-codes';
import Order from '../models/Order.js';
import CartService from '../services/cart.service.js';
import dotenv from 'dotenv';
import Voucher from '../models/Voucher.js';
import { generateOrderSuccessEmailTemplate } from '../mail/emailTemplate.js';
import { sendOrderSuccessEmail } from '../mail/emails.js';
import Variant from '../models/Variant.js';
import { createOrderLog } from './CreateOrderLog.js';
import Product from '../models/Product.js';
import { orderPopulateOptions } from '../services/order.service.js';
import { ORDER_LOG_TYPE, WRITE_LOG_BY } from '../models/Order_Log.js';

dotenv.config();

export async function createCodPayment(populatedOrder) {
  try {
    let redirectUrl = '';
    const order = await Order.findById(populatedOrder._id.toString()).populate(
      orderPopulateOptions
    );
    if (!order) {
      redirectUrl = `${process.env.CLIENT_BASE_URL}/payment?cancel=1`;
    }

    if (order.voucher) {
      const voucher = await Voucher.findById(order.voucher);
      if (voucher) {
        voucher.max_usage -= 1;
        await voucher.save();
      }
    }

    await Promise.all(
      order.items.map(async (item) => {
        const variant = await Variant.findById(item.variant._id);
        const product = await Product.findById(item.product._id);
        if (variant) {
          variant.stock -= item.quantity;
          variant.enable_delete = false;
        }
        if (product) {
          product.sold += item.quantity;
          product.enable_delete = false;
        }

        await product.save();
        await variant.save();
      })
    );

    await CartService.deleteAllCartItem({ user: { _id: order.user } });
    await order.save();
    const emailTemplate = generateOrderSuccessEmailTemplate(order);
    await sendOrderSuccessEmail(order.user_email, emailTemplate);
    await createOrderLog({
      order_id: order._id,
      type: ORDER_LOG_TYPE.CREATED,
      user_id: order.user._id,
      write_by: WRITE_LOG_BY.CUSTOMER,
    });
    redirectUrl = `${process.env.CLIENT_BASE_URL}/payment?success=1&order_id=${order._id}`;
    return redirectUrl;
  } catch (error) {
    console.error('Error cod payment:', error);
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Error cod payment');
  }
}
