import { StatusCodes } from 'http-status-codes';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Variant from '../models/Variant.js';
import ApiError from '../utils/ApiError.js';
import { checkRecordByField } from '../utils/CheckRecord.js';
import { Transformer } from '../utils/transformer.js';
import CartItemService from './cart_item.service.js';
import Cart_Item from '../models/Cart_Item.js';

export default class CartService {
  static getAllCarts = async (req) => {
    const carts = await Cart.find().populate([
      {
        path: 'cart_items',
        populate: { path: 'cart_item' },
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

    const user = await User.findById(userId)
    console.log(user)

    const cart = await Cart.findOne({ user : userId }).populate([
      {
        path: 'user',
      },
      {
        path: 'cart_items',
        populate: {
          path: 'cart_item',
        },
      },
    ]);
    
    if(!cart) {
      return []
    }

    cart.user.password = undefined;
    return Transformer.transformObjectTypeSnakeToCamel(cart.toObject());
  };

  static addItemToCart = async (req) => {
    const userId = req.user._id;
    checkRecordByField(User, '_id', userId, true);

    const { product_id, quantity, variant_id } = req.body;
    checkRecordByField(Product, '_id', product_id, true);
    checkRecordByField(Variant, '_id', variant_id, true);

    // check if cart item exist
    let cartItem = await CartItemService.findOneCartItemByVariant(req);
    // else  create cart item
    if (!cartItem) {
      cartItem = await CartItemService.createCartItem(req);
    }

    //check if user cart already exist if not create new one
    let userCart = await Cart.findOne({ user: userId }).populate({
      path: 'cart_items',
      populate: { path: 'cart_item' },
    });
    if (!userCart) {
      userCart = await Cart.create({ user: userId, cart_items: [] });

      await userCart.save();
    }

    // check if cartItem with same variant already in userCart
    const existCartItemIndex = userCart.cart_items.findIndex((item) => {
      return (
        item.cart_item.product.toString() == cartItem.product &&
        item.cart_item.variant.toString() == cartItem.variant &&
        item.cart_item.product_type == cartItem.product_type
      );
    });

    // if exist then change cart item id
    if (existCartItemIndex !== -1) {
      userCart.cart_items[existCartItemIndex].quantity = quantity;
    } else {
      const newCartItem = {
        cart_item: cartItem._id,
        quantity: quantity,
      };
      userCart.cart_items.push(newCartItem);
    }
    await userCart.save();

    const response = await Cart.findOne({ user: userId }).populate([
      { path: 'cart_items', populate: { path: 'cart_item' } },
      { path: 'user' },
    ]);

    response.user.password = undefined;
    return Transformer.transformObjectTypeSnakeToCamel(response.toObject());
  };

  static updateCartItemQuantity = async (req) => {
    const { id } = req.params;
    const { quantity } = req.body;
    const userId = req.user._id;
    checkRecordByField(User, '_id', userId, true);
    checkRecordByField(Cart_Item, '_id', id, true);

    // find user cart
    let userCart = await Cart.findOne({ user: userId }).populate({
      path: 'cart_items',
      populate: { path: 'cart_item' },
    });

    // find cart item to update quantity
    const cartItemIndex = userCart.cart_items.findIndex(
      (item) => item.cart_item._id.toString() === id
    );
    if (cartItemIndex !== -1) {
      if (quantity == 0) {
        userCart.cart_items.splice(cartItemIndex, 1);
      } else {
        userCart.cart_items[cartItemIndex].quantity = quantity;
      }
    }
    await userCart.save();

    const response = await Cart.findOne({ user: userId }).populate([
      { path: 'cart_items', populate: { path: 'cart_item' } },
      { path: 'user' },
    ]);

    response.user.password = undefined;
    return Transformer.transformObjectTypeSnakeToCamel(response.toObject());
  };

  static deleteOneCartItem = async (req) => {
    const { id } = req.params;
    const userId = req.user._id;
    checkRecordByField(User, '_id', userId, true);

    const userCart = await Cart.findOne({ user: userId }).populate([
      {
        path: 'user',
      },
      {
        path: 'cart_items',
        populate: {
          path: 'cart_item',
        },
      },
    ]);
    if (!userCart) throw new ApiError(StatusCodes.NOT_FOUND, 'User Cart is not found');
    // delete item
    userCart.cart_items = userCart.cart_items.filter((item) => {
      return !(item.cart_item._id.toString() === id);
    });

    await userCart.save();

    return Transformer.transformObjectTypeSnakeToCamel(userCart.toObject());
  };

  static deleteAllCartItem = async (req) => {
    const userId = req.user._id;
    const userCart = await Cart.findOne({ user: userId }).populate({ path: 'user' });
    if (!userCart) throw new ApiError(StatusCodes.NOT_FOUND, 'User Cart is not found');

    // delete all items
    userCart.cart_items = [];

    await userCart.save();

    return Transformer.transformObjectTypeSnakeToCamel(userCart.toObject());
  };
}
