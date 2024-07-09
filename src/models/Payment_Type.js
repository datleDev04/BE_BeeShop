import mongoose from 'mongoose';

// schema Gender variables
const DOCUMENT_NAME = 'Payment_Type';
const COLLECTION_NAME = 'Payment_Types';

const paymentTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: COLLECTION_NAME,
  }
);

export default mongoose.model(DOCUMENT_NAME, paymentTypeSchema);
