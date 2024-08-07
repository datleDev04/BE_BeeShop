import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { objectIdValidation } from '../validations/objectId.validation.js';
import { CartController } from '../controllers/cart.controller.js';

const cartRouter = express.Router();

cartRouter.get('/', authMiddleware, CartController.getAllCart);
cartRouter.get('/user', authMiddleware, CartController.getCartByUserId);

cartRouter.post('/', authMiddleware, CartController.addItem);

cartRouter.post('/:id', objectIdValidation, CartController.updateCart);

cartRouter.delete('/', authMiddleware, CartController.deleteOne);
export default cartRouter;
