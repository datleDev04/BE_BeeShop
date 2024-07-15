import mongoose, { Schema } from 'mongoose';
import MongooseDelete from 'mongoose-delete';
import mongoosePaginate from 'mongoose-paginate-v2';

// schema User variables
const DOCUMENT_NAME = 'Role';
const COLLECTION_NAME = 'Roles';

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    permissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission',
        require: true,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
    collection: COLLECTION_NAME,
  }
);

const plugins = [MongooseDelete, mongoosePaginate]

plugins.forEach((plugin) => {
  roleSchema.plugin(plugin, {
    deletedAt: true,
    overrideMethods: true,
  });
});
export default mongoose.model(DOCUMENT_NAME, roleSchema);
