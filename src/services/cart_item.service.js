import CartItem from '../models/Cart_Item.js';
import Product from '../models/Product.js';
import Product_Type from '../models/Product_Type.js';
import Variant from '../models/Variant.js';
import { checkRecordByField } from '../utils/CheckRecord.js';

export default class CartItemService {
  static createCartItem = async (req) => {
    const { product_id, variant_id } = req.body;
    checkRecordByField(Product, '_id', product_id, true);
    checkRecordByField(Variant, '_id', variant_id, true);

    const newCartItem = await CartItem.create({
      product: product_id,
      variant: variant_id,
    });
    await newCartItem.save();
    return newCartItem;
  };

  static findOneCartItemByVariant = async (req) => {
    const { product_id, variant_id } = req.body;
    checkRecordByField(Product, '_id', product_id, true);
    checkRecordByField(Variant, '_id', variant_id, true);

    const product = await Product.findOne({ _id: product_id }).populate({
      path: 'product_type',
    });

    const cartItem = await CartItem.findOne({
      product: product_id,
      variant: variant_id,
      product_type: product.product_type.name,
    });

    return cartItem;
  };
}
