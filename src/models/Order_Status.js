import mongoose from 'mongoose';
import MongooseDelete from 'mongoose-delete';
import mongoosePaginate from 'mongoose-paginate-v2';
// schema Order Status variables
const DOCUMENT_NAME = 'Order_Status';
const COLLECTION_NAME = 'Orders_Status';

const orderStatusSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
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
  orderStatusSchema.plugin(plugin, {
    deletedAt: true,
    overrideMethods: true,
  });
});

export default mongoose.model(DOCUMENT_NAME, orderStatusSchema);
