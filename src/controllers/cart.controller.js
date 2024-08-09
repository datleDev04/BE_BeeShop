import { StatusCodes } from 'http-status-codes';
import CartService from '../services/cart.service.js';
import { SuccessResponse } from '../utils/response.js';

export class CartController {
  static getAllCart = async (req, res, next) => {
    try {
      const { metaData } = await CartService.getAll();

      SuccessResponse(res, StatusCodes.OK, 'Get All Cart successfully', metaData);
    } catch (error) {
      next(error);
    }
  };
  static getOneCart = async (req, res, next) => {
    try {
      const cart = await CartService.getOne(req);

      SuccessResponse(res, StatusCodes.OK, 'Get User cart successfully', cart);
    } catch (error) {
      next(error);
    }
  };
  static addItem = async (req, res, next) => {
    try {
      const newCart = await CartService.addItem(req);

      SuccessResponse(res, StatusCodes.OK, 'Add Item to cart successfully', newCart);
    } catch (error) {
      next(error);
    }
  };
  static deleteOneCartItem = async (req, res, next) => {
    try {
      const newUserCart = await CartService.deleteOneItem(req);
      SuccessResponse(res, StatusCodes.OK, 'Delete Item in cart successfully', newUserCart);
    } catch (error) {
      next(error);
    }
  };
  static deleteAllCartItems = async (req, res, next) => {
    try {
      const newUserCart = await CartService.deleteAllItem(req);
      SuccessResponse(res, StatusCodes.OK, 'Delete All Items in cart successfully', newUserCart);
    } catch (error) {
      next(error);
    }
  };
}
