import express from 'express';
import { BannerController } from '../../controllers/banner.controller.js';
import { objectIdValidation } from '../../validations/objectId.validation.js';


const bannerClientRouter = express.Router();

bannerClientRouter.get(
  '/',
  BannerController.getAllBanners
);

bannerClientRouter.get(
  '/:id',
  objectIdValidation,
  BannerController.getBanner
);

export default bannerClientRouter