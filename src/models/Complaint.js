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
  RESOLVED: 'RESOLVED',
  CANCELLED: 'CANCELLED',
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
  },
  {
    timestamps: true,
    versionKey: false,
    collection: COLLECTION_NAME,
  }
);

export default mongoose.model(DOCUMENT_NAME, complaintSchema);
