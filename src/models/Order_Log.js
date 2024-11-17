import mongoose from 'mongoose';
import { ORDER_STATUS } from '../utils/constants.js';
// schema Order Logs variables

const DOCUMENT_NAME = 'Order_Log';
const COLLECTION_NAME = 'Order_Logs';

export const ORDER_LOG_TYPE = {
  CREATED: 'CREATED',
  UPDATE: 'UPDATE',
};

export const WRITE_LOG_BY = {
  ADMIN: 'ADMIN',
  CUSTOMER: 'CUSTOMER',
};

const orderLogSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      index: true,
    },
    performed_by_user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    log_type: {
      type: String,
      enum: Object.values(ORDER_LOG_TYPE),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PENDING,
    },
    write_by: { type: String, enum: Object.values(WRITE_LOG_BY), default: WRITE_LOG_BY.ADMIN },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: COLLECTION_NAME,
  }
);

orderLogSchema.index({ order: 1, createdAt: -1 });

export default mongoose.model(DOCUMENT_NAME, orderLogSchema);
