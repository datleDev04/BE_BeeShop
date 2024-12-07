import crypto from 'crypto';
import moment from 'moment';
import qs from 'qs';
import dotenv from 'dotenv';
import { PAYMENT_STATUS } from './constants.js';
import CartService from '../services/cart.service.js';
import Order from '../models/Order.js';
import OrderItem from '../models/Order_item.js';
import Voucher from '../models/Voucher.js';
import {
  generateOrderItemsTable,
  generateOrderSuccessEmailTemplate,
} from '../mail/emailTemplate.js';
import { orderPopulateOptions } from '../services/order.service.js';
import { sendOrderSuccessEmail } from '../mail/emails.js';
import Variant from '../models/Variant.js';
import { createOrderLog } from './CreateOrderLog.js';
import { ORDER_LOG_TYPE, WRITE_LOG_BY } from '../models/Order_Log.js';
import Product from '../models/Product.js';

dotenv.config();

export async function createVnpayPayment(req, populatedOrder) {
  const date = new Date();
  const createDate = moment(date).format('YYYYMMDDHHmmss');
  const ipAddr =
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  let vnp_Params = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: process.env.VNP_TMNCODE,
    vnp_Locale: 'vn',
    vnp_CurrCode: 'VND',
    vnp_TxnRef: populatedOrder._id,
    vnp_OrderInfo: 'Thanh toan cho ma GD:' + populatedOrder.unique_id,
    vnp_OrderType: 'other',
    vnp_Amount: populatedOrder.total_price * 100,
    vnp_ReturnUrl: `${process.env.SERVER_BASE_URL}/api/client/vnpay/vnpay_return`,
    vnp_CreateDate: createDate,
    vnp_IpAddr: ipAddr,
  };

  const secretKey = process.env.VNP_SECRET_KEY;
  let vnpUrl = process.env.VNP_URL;

  vnp_Params = sortObject(vnp_Params);

  let signData = qs.stringify(vnp_Params, { encode: false });
  let hmac = crypto.createHmac('sha512', secretKey);
  let signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');
  vnp_Params['vnp_SecureHash'] = signed;
  vnpUrl += '?' + qs.stringify(vnp_Params, { encode: false });

  return vnpUrl;
}

export async function createVnpayReturnUrl(req) {
  let vnp_Params = req.query;
  let redirectUrl = '';

  const secureHash = vnp_Params['vnp_SecureHash'];

  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  vnp_Params = sortObject(vnp_Params);

  const secretKey = process.env.VNP_SECRET_KEY;

  const signData = qs.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac('sha512', secretKey);
  const signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest('hex');

  if (secureHash === signed) {
    const orderId = vnp_Params['vnp_TxnRef'];
    const rspCode = vnp_Params['vnp_ResponseCode'];

    const order = await Order.findById(orderId).populate(orderPopulateOptions);
    if (!order) {
      redirectUrl = `${process.env.CLIENT_BASE_URL}/payment?cancel=1`;
    }

    if (rspCode === '00') {
      order.payment_status = PAYMENT_STATUS.COMPLETED;
      redirectUrl = `${process.env.CLIENT_BASE_URL}/payment?success=1&order_id=${order._id}`;

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
          }
          if (product) {
            product.sold += item.quantity;
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
      return redirectUrl;
    } else {
      const orderItems = order?.items;
      await OrderItem.deleteMany({ _id: { $in: orderItems } });
      await Order.findByIdAndDelete({ _id: order._id });
      redirectUrl = `${process.env.CLIENT_BASE_URL}/payment?cancel=1`;
    }
  } else {
    redirectUrl = `${process.env.CLIENT_BASE_URL}/payment?cancel=1`;
  }
  return redirectUrl;
}

export function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
  }
  return sorted;
}
