import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { objectIdValidation } from '../validations/objectId.validation.js';
import { CartController } from '../controllers/cart.controller.js';
import { CheckPermission } from '../utils/CheckPermission.js';

const cartRouter = express.Router();

cartRouter.get('/', authMiddleware, CheckPermission(['Read_Cart']), CartController.getAllCart);

cartRouter.get('/user', authMiddleware, CheckPermission(['Read_Cart']), CartController.getOneCart);

cartRouter.post('/', authMiddleware, CheckPermission(['Update_Cart']), CartController.addItem);

cartRouter.delete(
  '/:id',
  objectIdValidation,
  authMiddleware,
  CheckPermission(['Delete_Cart']),
  CartController.deleteOneCartItem
);

cartRouter.delete(
  '/',
  CheckPermission(['Delete_Cart']),
  authMiddleware,
  CartController.deleteAllCartItems
);
export default cartRouter;
