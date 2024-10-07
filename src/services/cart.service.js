import { StatusCodes } from 'http-status-codes';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Variant from '../models/Variant.js';
import ApiError from '../utils/ApiError.js';
import { checkRecordByField } from '../utils/CheckRecord.js';
import { Transformer } from '../utils/transformer.js';
import CartItem from '../models/Cart_Item.js';
import { populate } from 'dotenv';

export default class CartService {
  static getAllCarts = async (req) => {
    const carts = await Cart.find().populate([
      {
        path: 'cart_items',
        populate: [
          {
            path: 'product',
          },
          {
            path: 'variant',
          },
        ],
      },
      {
        path: 'user',
      },
    ]);
    const metaData = carts.map((cart) => {
      cart.user.password = undefined;
      const cartObj = cart.toObject();
      return Transformer.transformObjectTypeSnakeToCamel(cartObj);
    });
    return { metaData };
  };

  static getOneCartByUserId = async (req) => {
    const userId = req.user._id;
    checkRecordByField(User, '_id', userId, true);

    const user = await User.findById(userId);

    const cart = await Cart.findOne({ user: userId }).populate([
      {
        path: 'cart_items',
        populate: [
          {
            path: 'product',
          },
          {
            path: 'variant',
          },
        ],
      },
      {
        path: 'user',
      },
    ]);

    if (!cart) {
      return [];
    }

    cart.user.password = undefined;
    return Transformer.transformObjectTypeSnakeToCamel(cart.toObject());
  };

  static addItemToCart = async (req) => {
    const userId = req.user._id;
    const { product_id, quantity, variant_id } = req.body;

    checkRecordByField(User, '_id', userId, true);
    checkRecordByField(Product, '_id', product_id, true);
    checkRecordByField(Variant, '_id', variant_id, true);

    const variant = await Variant.findById(variant_id);
    if (quantity > variant.stock) {
      throw new ApiError(409, {
        quantity: `Only ${variant.stock} products left`,
      });
    }

    let userCart = await Cart.findOne({ user: userId }).populate([{ path: 'cart_items' }]);

    if (!userCart) {
      userCart = await Cart.create({ user: userId, cart_items: [] });
    }

    // Find existing cart item within the user's cart
    const existingCartItemId = userCart.cart_items.find(
      (item) => item.product.toString() === product_id && item.variant.toString() === variant_id
    );

    let cartItem;
    if (existingCartItemId) {
      cartItem = await CartItem.findById(existingCartItemId);
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({
        product: product_id,
        variant: variant_id,
        quantity: quantity,
      });
      userCart.cart_items.push(cartItem._id);
    }

    await userCart.save();

    const response = await Cart.findOne({ user: userId }).populate([
      {
        path: 'cart_items',
        populate: [
          { path: 'product' },
          { path: 'variant', populate: [{ path: 'size' }, { path: 'color' }] },
        ],
      },
      { path: 'user' },
    ]);

    response.user.password = undefined;
    return Transformer.transformObjectTypeSnakeToCamel(response.toObject());
  };

  static updateCartItemQuantity = async (req) => {
    const { id } = req.params;
    const { quantity } = req.body;
    const userId = req.user._id;
    await checkRecordByField(User, '_id', userId, true);
    await checkRecordByField(CartItem, '_id', id, true);

    // find user cart
    let userCart = await Cart.findOne({ user: userId }).populate({
      path: 'cart_items',
      populate: {
        path: 'variant',
        select: 'stock',
      },
    });

    if (!userCart) {
      throw new ApiError(404, 'Cart not found');
    }

    const currentCartItem = userCart.cart_items.find((item) => item._id.toString() === id);

    if (quantity > currentCartItem.variant.stock) {
      throw new ApiError(409, {
        quantity: `Only ${currentCartItem.variant.stock} products left`,
      });
    }

    // Update the quantity of the cart item
    currentCartItem.quantity = quantity;
    await currentCartItem.save();

    await userCart.save();

    const response = await Cart.findOne({ user: userId }).populate([
      {
        path: 'cart_items',
        populate: [
          { path: 'variant', populate: [{ path: 'color' }, { path: 'size' }] },
          { path: 'product' },
        ],
      },
      { path: 'user' },
    ]);

    response.user.password = undefined;
    return Transformer.transformObjectTypeSnakeToCamel(response.toObject());
  };

  static deleteOneCartItem = async (req) => {
    const { id } = req.params;
    const userId = req.user._id;
    await checkRecordByField(User, '_id', userId, true);
    await checkRecordByField(CartItem, '_id', id, true);

    const userCart = await Cart.findOne({ user: userId }).populate('cart_items');

    if (!userCart) throw new ApiError(StatusCodes.NOT_FOUND, 'User Cart is not found');
    // delete item
    userCart.cart_items = userCart.cart_items.filter((item) => item._id.toString() !== id);

    await CartItem.findByIdAndDelete(id);

    await userCart.save();

    return Transformer.transformObjectTypeSnakeToCamel(userCart.toObject());
  };

  static deleteAllCartItem = async (req) => {
    const userId = req.user._id;
    let userCart = await Cart.findOne({ user: userId }).populate({ path: 'user' });

    if (!userCart) {
      userCart = await Cart.create({ user: userId, cart_items: [] });
    }

    // Get all cart item ids
    const cartItemIds = userCart.cart_items;

    // Delete all CartItems
    await CartItem.deleteMany({ _id: { $in: cartItemIds } });

    // delete all items
    userCart.cart_items = [];

    await userCart.save();

    return Transformer.transformObjectTypeSnakeToCamel(userCart.toObject());
  };
}
