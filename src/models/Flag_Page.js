import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
// schema Voucher-Types variables
const DOCUMENT_NAME = 'Flag_Page';
const COLLECTION_NAME = 'Flag_Pages';

const flagPageSchema = new mongoose.Schema(
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

const plugins = [mongoosePaginate];

plugins.forEach((plugin) => {
  flagPageSchema.plugin(plugin, {
    deletedAt: true,
    overrideMethods: true,
  });
});

export default mongoose.model(DOCUMENT_NAME, flagPageSchema);
