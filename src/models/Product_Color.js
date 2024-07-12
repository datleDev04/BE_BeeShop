import mongoose from 'mongoose';

// schema Product Color variables
const DOCUMENT_NAME = 'Product_Color';
const COLLECTION_NAME = 'Product_Colors';

const productColorSchema = new mongoose.Schema(
  {
    color_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Color',
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    image_url: {
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

export default mongoose.model(DOCUMENT_NAME, productColorSchema);
