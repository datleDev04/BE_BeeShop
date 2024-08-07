import { StatusCodes } from 'http-status-codes';
import CartService from '../services/cart.service.js';
import { SuccessResponse } from '../utils/response.js';

export class CartController {
  static getAllCart = async (req, res, next) => {
    const { metaData } = await CartService.getAll();

    SuccessResponse(res, StatusCodes.OK, 'Get All Cart successfully', metaData);
  };
  static async createCart() {}
  static async getCartByUserId() {}
  static async updateCart() {}
  static addItem = async (req, res, next) => {
    try {
      const newCart = await CartService.addItem(req);

      SuccessResponse(res, StatusCodes.OK, 'Add Item to cart successfully', newCart);
    } catch (error) {
      next(error);
    }
  };
  static async deleteOneCartItem() {}
  static async deleteAllCartItems() {}
  static deleteOne = async (req, res, next) => {
    try {
      const cart_delete = await CartService.deleteOne(req);
      SuccessResponse(res, StatusCodes.OK, 'Delete One Cart successfully', cart_delete);
    } catch (error) {
      next(error);
    }
  };
}
