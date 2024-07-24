import mongoose from 'mongoose';
import MongooseDelete from 'mongoose-delete';
import mongoosePaginate from 'mongoose-paginate-v2';
// schema Gender variables
const DOCUMENT_NAME = 'Gender';
const COLLECTION_NAME = 'Genders';

const genderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
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
  genderSchema.plugin(plugin, {
    deletedAt: true,
    overrideMethods: true,
  });
});
export default mongoose.model(DOCUMENT_NAME, genderSchema);
