import express from 'express';
import { BannerController } from '../controllers/banner.controller.js';

import { objectIdValidation } from '../validations/objectId.validation.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { CheckPermission } from '../utils/CheckPermission.js';
import {
  createBannerValidation,
  updateBannerValidation,
} from '../validations/banner.validation.js';

const bannerRouter = express.Router();

bannerRouter.get(
  '/',
  authMiddleware,
  CheckPermission(['Read_Banner']),
  BannerController.getAllBanners
);
bannerRouter.get(
  '/:id',
  authMiddleware,
  CheckPermission(['Read_Banner']),
  objectIdValidation,
  BannerController.getBanner
);

// create new banner
bannerRouter.post(
  '/',
  authMiddleware,
  CheckPermission(['Create_Banner']),
  createBannerValidation,
  BannerController.createNewBanner
);

// update banner by id
bannerRouter.patch(
  '/:id',
  authMiddleware,
  CheckPermission(['Update_Banner']),
  objectIdValidation,
  updateBannerValidation,
  BannerController.updateBanner
);

// delete banner by id
bannerRouter.delete(
  '/:id',
  authMiddleware,
  CheckPermission(['Delete_Banner']),
  objectIdValidation,
  BannerController.deleteBanner
);

export default bannerRouter;
