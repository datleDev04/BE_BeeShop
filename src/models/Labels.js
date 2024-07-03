import mongoose, { Schema } from 'mongoose';

// schema User variables
const DOCUMENT_NAME = 'Label';
const COLLECTION_NAME = 'Labels';

const LabelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: COLLECTION_NAME,
  }
);

export default mongoose.model(DOCUMENT_NAME, LabelSchema);
