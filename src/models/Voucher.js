import mongoose from 'mongoose';
import MongooseDelete from 'mongoose-delete';
import mongoosePaginate from 'mongoose-paginate-v2';
import { STATUS } from '../utils/constants.js';

// schema Voucher variables
const DOCUMENT_NAME = 'Voucher';
const COLLECTION_NAME = 'Vouchers';

export const VOUCHER_TYPES = {
  PERIOD: 'PERIOD',
  FREE_SHIPPING: 'FREE_SHIPPING',
  DEADLINE: "DEADLINE"
};

const voucherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    max_usage: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
    },
    discount: {
      type: Number,
      required: true,
    },
    status: {
      type: Number,
      enum: [STATUS.ACTIVE, STATUS.INACTIVE],
      default: STATUS.ACTIVE,
    },
    discount_types: {
      type: String,
      enum: ['percentage', 'fixed'],
    },
    minimum_order_price: {
      type: Number,
    },
    voucher_type: {
      type: String,
      enum: Object.values(VOUCHER_TYPES),
      required: true,
    },
    start_date: {
      type: Date,
    },
    end_date: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: COLLECTION_NAME,
  }
);

const plugins = [MongooseDelete, mongoosePaginate];

plugins.forEach((plugin) => {
  voucherSchema.plugin(plugin, {
    deletedAt: true,
    overrideMethods: true,
  });
});

export default mongoose.model(DOCUMENT_NAME, voucherSchema);
