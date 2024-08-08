import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
// schema Product variables
const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

export const PRODUCT_STATUS = {
  INACTIVE: 0,
  ACTIVE: 1,
};

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
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
    thumbnail: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
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
        ref: 'Size',
        required: true,
      },
    ],
    product_type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product_Type',
      required: true,
    },
    flag: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Flag_Page',
    },
    status: {
      type: Number,
      enum: [PRODUCT_STATUS.ACTIVE, PRODUCT_STATUS.INACTIVE],
      default: PRODUCT_STATUS.ACTIVE,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: COLLECTION_NAME,
  }
);

productSchema.plugin(mongoosePaginate, {
  deletedAt: true,
  overrideMethods: true,
});

export default mongoose.model(DOCUMENT_NAME, productSchema);
