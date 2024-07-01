import mongoose, { Schema } from 'mongoose';

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

export default mongoose.model(DOCUMENT_NAME, roleSchema);
