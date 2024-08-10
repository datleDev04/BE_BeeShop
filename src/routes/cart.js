import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { objectIdValidation } from '../validations/objectId.validation.js';
import { CartController } from '../controllers/cart.controller.js';
import { CheckPermission } from '../utils/CheckPermission.js';

const cartRouter = express.Router();

cartRouter.get('/', authMiddleware, CheckPermission(['Read_Cart']), CartController.getAllCarts);

cartRouter.get(
  '/user',
  authMiddleware,
  CheckPermission(['Read_Cart']),
  CartController.getOneCartByUserId
);

cartRouter.post(
  '/',
  authMiddleware,
  CheckPermission(['Update_Cart']),
  CartController.addItemToCart
);

cartRouter.patch(
  '/:cartItemId',
  authMiddleware,
  CheckPermission(['Update_Cart']),
  CartController.updateQuantityOneCart
);

cartRouter.delete(
  '/:id',
  objectIdValidation,
  authMiddleware,
  CheckPermission(['Delete_Cart']),
  CartController.deleteOneCartItem
);

cartRouter.delete(
  '/',
  authMiddleware,
  CheckPermission(['Delete_Cart']),
  CartController.deleteAllCartItems
);
export default cartRouter;
