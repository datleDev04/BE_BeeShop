import mongoose, { Schema } from 'mongoose';

// schema User variables
const DOCUMENT_NAME = 'Permission';
const COLLECTION_NAME = 'Permissions';

const permissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    module: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
    versionKey: false,
    collection: COLLECTION_NAME,
  }
);

export default mongoose.model(DOCUMENT_NAME, permissionSchema);
