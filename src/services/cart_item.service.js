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

    const product = (await Product.findOne({ _id: product_id })).populated({
      path: 'product_type',
    });
    const variant = await Variant.findOne({ _id: variant_id }).populate([
      {
        path: 'size',
      },
      { path: 'color' },
    ]);
    const newCartItem = await CartItem.create({
      product_id: product_id,
      product_name: product.name,
      product_image: product.thumbnail,
      product_type: product.product_type.name,
      price: variant.price,
      size: variant.size.name,
      color: variant.color.name,
      variant_id: variant_id,
    });
    await newCartItem.save();
    return newCartItem;
  };
  static findOneCartItemByVariant = async (req) => {
    const { product_id, variant_id, product_type } = req.body;
    const productType = await Product_Type.findOne({ _id: product_type });

    const cartItem = await CartItem.findOne({
      product_id: product_id,
      variant_id: variant_id,
      product_type: productType.name,
    });

    return cartItem;
  };
}
