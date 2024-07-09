import mongoose, { Schema } from 'mongoose';

// schema User variables
const DOCUMENT_NAME = 'Size';
const COLLECTION_NAME = 'Sizes';

const sizeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    gender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gender',
      require: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: COLLECTION_NAME,
  }
);

export default mongoose.model(DOCUMENT_NAME, sizeSchema);
