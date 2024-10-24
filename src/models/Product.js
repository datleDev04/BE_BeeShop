import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { FLAG_PAGE, STATUS } from '../utils/constants.js';

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
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    sort_description: {
      type: String,
    },
    description: {
      type: String,
      required: true,
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
      type: String,
      enum: Object.values(FLAG_PAGE),
      default: FLAG_PAGE.ALLPAGE,
    },
    status: {
      type: Number,
      enum: [STATUS.ACTIVE, STATUS.INACTIVE],
      default: STATUS.ACTIVE,
    },
    dimensions: {
      weight: {
        type: Number,
        required: true,
        min: 0,
      },
      length: {
        type: Number,
        required: true,
        min: 0,
      },
      width: {
        type: Number,
        required: true,
        min: 0,
      },
      height: {
        type: Number,
        required: true,
        min: 0,
      },
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
