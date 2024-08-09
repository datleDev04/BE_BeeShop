import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { objectIdValidation } from '../validations/objectId.validation.js';
import { CartController } from '../controllers/cart.controller.js';

const cartRouter = express.Router();

cartRouter.get('/', authMiddleware, CartController.getAllCart);

cartRouter.get('/user', authMiddleware, CartController.getOneCart);

cartRouter.post('/', authMiddleware, CartController.addItem);

cartRouter.delete('/:id', authMiddleware, CartController.deleteOneCartItem);

cartRouter.delete('/', authMiddleware, CartController.deleteAllCartItems);
export default cartRouter;
