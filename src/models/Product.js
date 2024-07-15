import mongoose from 'mongoose';

// schema Product variables
const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug_name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    regular_price: {
      type: Number,
      required: true,
    },
    discount_price: {
      type: Number,
    },
    images: {
      type: [String],
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
        required: true,
      },
    ],
    gender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gender',
      required: true,
    },
    variants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Variant',
        required: true,
      },
    ],
    labels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Label',
        required: true,
      },
    ],
    isPublic: {
      type: Boolean,
      default: false,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
      required: true,
    },
    product_colors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product_Color',
        required: true,
      },
    ],
    product_sizes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product_Size',
        required: true,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
    collection: COLLECTION_NAME,
  }
);

export default mongoose.model(DOCUMENT_NAME, productSchema);
