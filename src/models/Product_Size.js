import mongoose from 'mongoose';

// schema Product Size variables
const DOCUMENT_NAME = 'Product_Size';
const COLLECTION_NAME = 'Product_Sizes';

const productSizeSchema = new mongoose.Schema(
  {
    size_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Color',
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: COLLECTION_NAME,
  }
);

export default mongoose.model(DOCUMENT_NAME, productSizeSchema);
