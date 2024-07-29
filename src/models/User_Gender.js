import mongoose from 'mongoose';
import MongooseDelete from 'mongoose-delete';
import mongoosePaginate from 'mongoose-paginate-v2';

// schema User_Gender variables
const DOCUMENT_NAME = 'User_Gender';
const COLLECTION_NAME = 'User_Genders';

const userGenderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
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
  userGenderSchema.plugin(plugin, {
    deletedAt: true,
    overrideMethods: true,
  });
});

export default mongoose.model(DOCUMENT_NAME, userGenderSchema);
