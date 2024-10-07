import crypto from 'crypto';
import moment from 'moment';
import qs from 'qs';
import dotenv from 'dotenv';

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
    vnp_OrderInfo: 'Thanh toan cho ma GD:' + populatedOrder._id,
    vnp_OrderType: 'other',
    vnp_Amount: populatedOrder.total_price * 100,
    vnp_ReturnUrl: `${process.env.CLIENT_BASE_URL}/payment/vnpay`,
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

function sortObject(obj) {
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
