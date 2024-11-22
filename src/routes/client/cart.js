import express from 'express';

import { authMiddleware } from '../../middleware/authMiddleware.js';
import { CartController } from '../../controllers/cart.controller.js';
import { objectIdValidation } from '../../validations/objectId.validation.js';

const cartRouter = express.Router();

cartRouter.get('/', authMiddleware, CartController.getAllCarts);

cartRouter.get('/user', authMiddleware, CartController.getOneCartByUserId);

cartRouter.post('/', authMiddleware, CartController.addItemToCart);

cartRouter.patch('/:id', authMiddleware, CartController.updateQuantityOneCart);

cartRouter.delete('/:id', objectIdValidation, authMiddleware, CartController.deleteOneCartItem);

cartRouter.delete('/', authMiddleware, CartController.deleteAllCartItems);

export default cartRouter;
