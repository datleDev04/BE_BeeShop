import mongoose from 'mongoose';

// schema Address variables
const DOCUMENT_NAME = 'Address';
const COLLECTION_NAME = 'Address';

const addressSchema = new mongoose.Schema(
  {
    commune: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    user_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
      },
    ],
    detail_address: {
      type: String,
    },
    default: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: COLLECTION_NAME,
  }
);

export default mongoose.model(DOCUMENT_NAME, addressSchema);
