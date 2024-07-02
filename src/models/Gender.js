import mongoose from 'mongoose';

// schema Gender variables
const DOCUMENT_NAME = 'Gender';
const COLLECTION_NAME = 'Genders';

const genderSchema = new mongoose.Schema(
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

export default mongoose.model(DOCUMENT_NAME, genderSchema);
