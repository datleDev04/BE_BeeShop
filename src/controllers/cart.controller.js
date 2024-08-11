import { StatusCodes } from 'http-status-codes';
import CartService from '../services/cart.service.js';
import { SuccessResponse } from '../utils/response.js';

export class CartController {
  static getAllCarts = async (req, res, next) => {
    try {
      const { metaData } = await CartService.getAllCarts();

      SuccessResponse(res, StatusCodes.OK, 'Get All Cart successfully', metaData);
    } catch (error) {
      next(error);
    }
  };
  static getOneCartByUserId = async (req, res, next) => {
    try {
      const cart = await CartService.getOneCartByUserId(req);

      SuccessResponse(res, StatusCodes.OK, 'Get User cart successfully', cart);
    } catch (error) {
      next(error);
    }
  };
  static addItemToCart = async (req, res, next) => {
    try {
      const newCart = await CartService.addItemToCart(req);

      SuccessResponse(res, StatusCodes.OK, 'Update Item to cart successfully', newCart);
    } catch (error) {
      next(error);
    }
  };
  static updateQuantityOneCart = async (req, res, next) => {
    try {
      const newCart = await CartService.updateCartItemQuantity(req);
      SuccessResponse(res, StatusCodes.OK, 'Update Item to cart successfully', newCart);
    } catch (error) {
      next(error);
    }
  };
  static deleteOneCartItem = async (req, res, next) => {
    try {
      const newUserCart = await CartService.deleteOneCartItem(req);
      SuccessResponse(res, StatusCodes.OK, 'Delete Item in cart successfully', newUserCart);
    } catch (error) {
      next(error);
    }
  };
  static deleteAllCartItems = async (req, res, next) => {
    try {
      const newUserCart = await CartService.deleteAllCartItem(req);
      SuccessResponse(res, StatusCodes.OK, 'Delete All Items in cart successfully', newUserCart);
    } catch (error) {
      next(error);
    }
  };
}
