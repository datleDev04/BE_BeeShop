import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { ORDER_STATUS, PAYMENT_STATUS, PAYMENT_TYPE } from '../utils/constants.js';
// schema Order Status variables
const DOCUMENT_NAME = 'Order';
const COLLECTION_NAME = 'Orders';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order_Item',
        required: true,
      },
    ],
    total_price: {
      type: Number,
      required: true,
      min: 0,
    },
    regular_total_price: {
      type: Number,
      min: 0,
    },
    shipping_address: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
      required: true,
    },
    order_status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PENDING,
      required: true,
    },
    payment_status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
      required: true,
    },
    payment_type: {
      type: String,
      enum: Object.values(PAYMENT_TYPE),
      default: PAYMENT_TYPE.VNPAY,
      required: true,
    },
    shipping_method: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shipping_Method',
      required: true,
    },
    voucher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Voucher',
    },
    user_name: {
      type: String,
      required: true,
    },
    shipping_fee: {
      type: Number,
      default: 0,
      required: true,
    },
    user_email: {
      type: String,
      required: true,
    },
    tracking_number: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: COLLECTION_NAME,
  }
);

orderSchema.plugin(mongoosePaginate, {
  deletedAt: true,
  overrideMethods: true,
});

export default mongoose.model(DOCUMENT_NAME, orderSchema);
