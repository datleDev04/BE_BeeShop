import express from "express";
import { objectIdValidation } from "../../validations/objectId.validation.js";
import { WishListController } from "../../controllers/client/wishlist.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const wishListClientRouter = express.Router();


wishListClientRouter.get('/', authMiddleware,WishListController.getall);

wishListClientRouter.patch(
  '/remove-all',
  authMiddleware,
  WishListController.removeAllItems
);


wishListClientRouter.patch(
  '/:id',
  authMiddleware,
  objectIdValidation,
  WishListController.updateItems
);



export default wishListClientRouter