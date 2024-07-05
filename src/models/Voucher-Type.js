import mongoose from 'mongoose';

// schema Voucher-Types variables
const DOCUMENT_NAME = 'Voucher-Type';
const COLLECTION_NAME = 'Voucher-Types';

const voucherTypeSchema = new mongoose.Schema(
  {
    name: {
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

export default mongoose.model(DOCUMENT_NAME, voucherTypeSchema);
