import mongoose, { Schema } from 'mongoose';
import MongooseDelete from 'mongoose-delete';
import mongoosePaginate from 'mongoose-paginate-v2';

// schema User variables
const DOCUMENT_NAME = 'User';
const COLLECTION_NAME = 'Users';

const userSchema = new mongoose.Schema(
  {
    user_name: {
      type: String,
      unique: true,
      required: true,
    },
    google_id: {
      type: String,
      sparse: true,
    },
    avatar_url: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
      },
    ],
    address_list: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
    collection: COLLECTION_NAME,
  }
);

const plugins = [MongooseDelete, mongoosePaginate];

plugins.forEach((plugin) => {
  userSchema.plugin(plugin, {
    deletedAt: true,
    overrideMethods: true,
  });
});

export default mongoose.model(DOCUMENT_NAME, userSchema);
