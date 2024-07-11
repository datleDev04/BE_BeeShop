import mongoose from 'mongoose';

// schema Order Status variables
const DOCUMENT_NAME = 'Order_Status';
const COLLECTION_NAME = 'Orders_Status';

const orderStatusSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: COLLECTION_NAME,
  }
);

export default mongoose.model(DOCUMENT_NAME, orderStatusSchema);
