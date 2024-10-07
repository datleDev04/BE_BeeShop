import PayOS from '@payos/node';
import ApiError from './ApiError.js';
import { StatusCodes } from 'http-status-codes';

const payOS = new PayOS(
  process.env.PAYOS_CLIENT_ID,
  process.env.PAYOS_API_KEY,
  process.env.PAYOS_CHECKSUM_KEY
);

export async function createPayosPayment(populatedOrder) {
  const total_price = populatedOrder.total_price;

  const payOsOptions = {
    orderCode: Number(String(new Date().getTime()).slice(-6)),
    amount: total_price,
    description: 'Thanh toan don hang',
    items: populatedOrder.items.map((item) => ({
      name: item.product.name,
      quantity: item.quantity,
      price: item.price,
    })),
    cancelUrl: `${process.env.CLIENT_BASE_URL}/payment/payos?cancel=1&orderId=${populatedOrder._id}`,
    returnUrl: `${process.env.CLIENT_BASE_URL}/payment/payos?success=1&orderId=${populatedOrder._id}`,
  };

  try {
    const paymentLinkRes = await payOS.createPaymentLink(payOsOptions);
    return paymentLinkRes.checkoutUrl;
  } catch (error) {
    console.error('Error creating PayOS payment link:', error);
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Error creating PayOS payment link');
  }
}

export default payOS;
