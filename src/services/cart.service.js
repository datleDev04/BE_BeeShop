import { StatusCodes } from 'http-status-codes';
import Cart from '../models/Cart.js';
import CartItem from '../models/Cart_Item.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Variant from '../models/Variant.js';
import ApiError from '../utils/ApiError.js';
import { checkRecordByField } from '../utils/CheckRecord.js';
import { Transformer } from '../utils/transformer.js';
import Product_Type from '../models/Product_Type.js';

export default class CartService {
  static getAll = async (req) => {
    const carts = await Cart.find().populate({ path: 'cart_items' });
    const metaData = carts.map((cart) => {
      const cartObj = cart.toObject();
      return Transformer.transformObjectTypeSnakeToCamel(cartObj);
    });
    return { metaData };
  };
  static addItem = async (req) => {
    const userId = req.user._id;
    checkRecordByField(User, '_id', userId, true);

    const { product_id, quantity, variant_id, product_type } = req.body;
    checkRecordByField(Product, '_id', product_id, true);
    checkRecordByField(Variant, '_id', variant_id, true);
    checkRecordByField(Product_Type, '_id', product_type, true);

    const product = await Product.findOne({ _id: product_id });

    const variant = await Variant.findOne({ _id: variant_id }).populate([
      {
        path: 'size',
      },
      { path: 'color' },
    ]);

    // check if cart item exist
    let cartItem = await CartItem.findOne({
      product_id: product_id,
      variant_id: variant_id,
      quantity: quantity,
      product_type: product_type,
    });

    // else  create cart item
    if (!cartItem) {
      cartItem = await CartItem.create({
        product_id: product_id,
        product_name: product.name,
        product_image: product.thumbnail,
        product_type: product_type,
        price: variant.price,
        size: variant.size.name,
        color: variant.color.name,
        variant_id: variant_id,
        quantity: quantity,
      });
    }
    await cartItem.save();

    //check if user cart already exist if not create new one
    let userCart = await Cart.findOne({ user_id: userId }).populate({ path: 'cart_items' });
    if (!userCart) {
      userCart = await Cart.create({ user_id: userId, cart_items: [] });

      await userCart.save();
    }

    // check if cartItem with same variant already in userCart
    const existCartItemIndex = userCart.cart_items.findIndex((item) => {
      return (
        item.product_id.toString() == product_id &&
        item.variant_id.toString() == variant_id &&
        item.product_type.toString() == product_type
      );
    });

    // if exist then change cart item id
    if (existCartItemIndex !== -1) {
      userCart.cart_items[existCartItemIndex] = cartItem;
    } else {
      userCart.cart_items.push(cartItem);
    }
    await userCart.save();

    const response = await Cart.findOne({ user_id: userId }).populate([
      { path: 'cart_items' },
      { path: 'user_id' },
    ]);

    return Transformer.transformObjectTypeSnakeToCamel(response.toObject());
  };

  static deleteOneItem = async (req) => {
    const { id } = req.params;
    const userId = req.user._id;

    const userCart = await Cart.findOne({ user_id: userId });

    console.log(userCart, id);

    // delete item
    userCart.cart_items = userCart.cart_items.filter((item) => item._id.toString() == id);

    await userCart.save();

    return Transformer.transformObjectTypeSnakeToCamel(userCart.toObject());
  };

  static deleteAllItem = async (req) => {
    const userId = req.user._id;
    const userCart = await Cart.findOne({ user_id: userId }).populate({ path: 'user_id' });

    // delete all items
    userCart.cart_items = [];

    await userCart.save();

    return Transformer.transformObjectTypeSnakeToCamel(userCart.toObject());
  };
}
