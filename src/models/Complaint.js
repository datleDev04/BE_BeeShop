import mongoose from 'mongoose';

const DOCUMENT_NAME = 'Complaint';
const COLLECTION_NAME = 'Complaints';

const COMPLAINT_REASONS = {
  PRODUCT_DAMAGED: 'PRODUCT_DAMAGED',
  WRONG_ITEM_RECEIVED: 'WRONG_ITEM_RECEIVED',
  MISSING_ITEM: 'MISSING_ITEM',
  LATE_DELIVERY: 'LATE_DELIVERY',
  OTHER: 'OTHER',
};

export const COMPLAINT_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPENSATE: 'COMPENSATE',
  RESOLVED: 'RESOLVED',
  REJECTED: 'REJECTED',
  WITHDRAWN: 'WITHDRAWN',
};

const complaintSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Order',
    },
    reason: {
      type: String,
      enum: Object.values(COMPLAINT_REASONS),
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: Object.values(COMPLAINT_STATUS),
      default: COMPLAINT_STATUS.PENDING,
    },
    reject_reason: {
      type: String,
    },
    admin_note: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: COLLECTION_NAME,
  }
);

export default mongoose.model(DOCUMENT_NAME, complaintSchema);
