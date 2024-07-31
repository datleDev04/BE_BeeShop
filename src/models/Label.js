import mongoose from 'mongoose';
import MongooseDelete from 'mongoose-delete';
import mongoosePaginate from 'mongoose-paginate-v2';

// schema User variables
const DOCUMENT_NAME = 'Label';
const COLLECTION_NAME = 'Labels';

export const LABEL_STATUS = {
  ACTIVE: 0,
  INACTIVE: 1,
};

const labelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      require: true,
      unique: true,
    },
    description: {
      type: String,
    },
    status: {
      type: Number,
      enum: [LABEL_STATUS.ACTIVE, LABEL_STATUS.INACTIVE],
      default: LABEL_STATUS.ACTIVE,
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
  labelSchema.plugin(plugin, {
    deletedAt: true,
    overrideMethods: true,
  });
});

export default mongoose.model(DOCUMENT_NAME, labelSchema);
