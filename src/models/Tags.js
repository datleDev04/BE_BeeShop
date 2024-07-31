import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

// schema User variables
const DOCUMENT_NAME = 'Tag';
const COLLECTION_NAME = 'Tags';

export const TAG_STATUS = {
  ACTIVE: 0,
  INACTIVE: 1,
};

const TagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    parent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tag',
    },
    status: {
      type: Number,
      enum: [TAG_STATUS.ACTIVE, TAG_STATUS.INACTIVE],
      default: TAG_STATUS.ACTIVE,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: COLLECTION_NAME,
  }
);

TagSchema.plugin(mongoosePaginate);

export default mongoose.model(DOCUMENT_NAME, TagSchema);
