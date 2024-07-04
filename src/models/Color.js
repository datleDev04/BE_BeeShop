import mongoose from 'mongoose';

// schema Color variables
const DOCUMENT_NAME = 'Color';
const COLLECTION_NAME = 'Colors';

const colorSchema = new mongoose.Schema(
  {
    name: {
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

export default mongoose.model(DOCUMENT_NAME, colorSchema);
