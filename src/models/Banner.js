import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const DOCUMENT_NAME = 'Banner';
const COLLECTION_NAME = 'Banners';

const bannerSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image_url: {
      type: String,
      required: true,
    },
    path: {
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

bannerSchema.plugin(mongoosePaginate, {
  deletedAt: true,
  overrideMethods: true,
});
export default mongoose.model(DOCUMENT_NAME, bannerSchema);
