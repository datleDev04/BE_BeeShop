import mongoose from 'mongoose';

// schema Variant variables
const DOCUMENT_NAME = 'Variant';
const COLLECTION_NAME = 'Variants';

const variantSchema = new mongoose.Schema(
  {
    color: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Color',
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    size: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Size',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: COLLECTION_NAME,
  }
);

export default mongoose.model(DOCUMENT_NAME, variantSchema);
