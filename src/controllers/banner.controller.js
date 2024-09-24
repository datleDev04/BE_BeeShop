import { StatusCodes } from 'http-status-codes';
import { SuccessResponse } from '../utils/response.js';
import BannerService from '../services/banner.service.js';

export class BannerController {
  static createNewBanner = async (req, res, next) => {
    try {
      const newBanner = await BannerService.createNewBanner(req);

      SuccessResponse(res, StatusCodes.CREATED, 'Create new banner successfully', newBanner);
    } catch (error) {
      next(error);
    }
  };
  static getBanner = async (req, res, next) => {
    try {
      const banner = await BannerService.getOneBanner(req);

      SuccessResponse(res, StatusCodes.OK, 'Get banner successfully', banner);
    } catch (error) {
      next(error);
    }
  };
  static getAllBanners = async (req, res, next) => {
    try {
      const { metaData, others } = await BannerService.getAllBanners(req);

      SuccessResponse(res, StatusCodes.OK, 'Get All Banners successfully', metaData, others);
    } catch (error) {
      next(error);
    }
  };

  static updateBanner = async (req, res, next) => {
    try {
      const banner = await BannerService.updateBannerById(req);

      SuccessResponse(res, StatusCodes.OK, 'Updated Banner successfully', banner);
    } catch (error) {
      next(error);
    }
  };
  static deleteBanner = async (req, res, next) => {
    try {
      await BannerService.deleteBannerById(req);

      SuccessResponse(res, StatusCodes.OK, 'Delete Banner successfully', {});
    } catch (error) {
      next(error);
    }
  };
}
