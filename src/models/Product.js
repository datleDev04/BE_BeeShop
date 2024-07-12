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
    tag_list: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
      },
    ],
    gender_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gender',
    },
    variant_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Variant',
      },
    ],
    label: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Label',
      },
    ],
    isPublic: {
      type: Boolean,
      default: false,
    },
    brand_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
    },
    product_color_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product_Color',
      },
    ],
    product_size_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product_Size',
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
