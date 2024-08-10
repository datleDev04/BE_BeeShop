import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const DOCUMENT_NAME = 'Cart_Item';
const COLLECTION_NAME = 'Cart_Items';

const cartItemSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    product_image: {
      type: String,
      required: true,
    },
    product_type: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
    },
    variant_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Variant',
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: COLLECTION_NAME,
  }
);

cartItemSchema.plugin(mongoosePaginate, {
  deletedAt: true,
  overrideMethods: true,
});

export default mongoose.model(DOCUMENT_NAME, cartItemSchema);
