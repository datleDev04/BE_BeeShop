import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
// schema Product variables
const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

export const PRODUCT_STATUS = {
  ACTIVE: 0,
  INACTIVE: 1,
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
    },
    thumbnail: {
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
      },
    ],
    gender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gender',
    },
    variants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Variant',
      },
    ],
    labels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Label',
      },
    ],
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
    },
    product_colors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product_Color',
      },
    ],
    product_sizes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Size',
      },
    ],
    product_type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product_Type',
      },
    ],
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
