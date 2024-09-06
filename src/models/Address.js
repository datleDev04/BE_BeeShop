import mongoose from 'mongoose';
import MongooseDelete from 'mongoose-delete';
import mongoosePaginate from 'mongoose-paginate-v2';

// schema Address variables
const DOCUMENT_NAME = 'Address';
const COLLECTION_NAME = 'Address';

const addressSchema = new mongoose.Schema(
  {
    commune: {
      type: String,
      default: '',
    },
    district: {
      type: String,
    },
    city: {
      type: String,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      require: true,
    },
    detail_address: {
      type: String,
    },
    default: {
      type: Boolean,
      default: false,
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
  addressSchema.plugin(plugin, {
    deletedAt: true,
    overrideMethods: true,
  });
});

export default mongoose.model(DOCUMENT_NAME, addressSchema);
