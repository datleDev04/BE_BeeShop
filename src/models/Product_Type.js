import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
// schema Gender variables
const DOCUMENT_NAME = 'Product_Type';
const COLLECTION_NAME = 'Product_Types';

const productTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    image_url: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: COLLECTION_NAME,
  }
);

productTypeSchema.plugin(mongoosePaginate, {
  deletedAt: true,
  overrideMethods: true,
});

export default mongoose.model(DOCUMENT_NAME, productTypeSchema);
