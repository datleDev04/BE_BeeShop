import mongoose from 'mongoose';

// schema User variables
const DOCUMENT_NAME = 'Label';
const COLLECTION_NAME = 'Labels';

const labelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: COLLECTION_NAME,
  }
);

export default mongoose.model(DOCUMENT_NAME, labelSchema);
