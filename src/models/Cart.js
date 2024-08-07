import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const DOCUMENT_NAME = 'Cart';
const COLLECTION_NAME = 'Carts';

const cartSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      unique: true,
    },
    cart_items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart_Item',
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
    collection: COLLECTION_NAME,
  }
);

cartSchema.plugin(mongoosePaginate, {
  deletedAt: true,
  overrideMethods: true,
});
export default mongoose.model(DOCUMENT_NAME, cartSchema);
