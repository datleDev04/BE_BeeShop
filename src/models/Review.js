import mongoose from 'mongoose';
import MongooseDelete from 'mongoose-delete';
import mongoosePaginate from 'mongoose-paginate-v2';
import { STATUS } from '../utils/constants.js'
// schema Review variables
const DOCUMENT_NAME = 'Review';
const COLLECTION_NAME = 'Reviews';

const reviewSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
    },
    rates: {
      type: Number,
      min: 1,
      max: 5,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    order_item: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Order_Item'
    },
    reply: {
      type: mongoose.Schema.Types.ObjectId,
    },
    status: {
      type: Object.values(STATUS),
      default: STATUS.ACTIVE,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: COLLECTION_NAME,
  }
);
const plugins = [MongooseDelete, mongoosePaginate];

plugins.forEach((plugin) => {
  reviewSchema.plugin(plugin, {
    deletedAt: true,
    overrideMethods: true,
  });
});
export default mongoose.model(DOCUMENT_NAME, reviewSchema);
