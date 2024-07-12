import mongoose from 'mongoose';

// schema Comment variables
const DOCUMENT_NAME = 'Comment';
const COLLECTION_NAME = 'Comments';

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    image_urls: {
      type: [String],
    },
    parent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: COLLECTION_NAME,
  }
);

export default mongoose.model(DOCUMENT_NAME, commentSchema);
