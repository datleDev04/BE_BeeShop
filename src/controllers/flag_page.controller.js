import { StatusCodes } from 'http-status-codes';
import { SuccessResponse } from '../utils/response.js';
import FlagPageService from '../services/flag_page.service.js';

export class FlagPageController {
  static createNewFlagPage = async (req, res, next) => {
    try {
      const newFlagPage = await FlagPageService.createFlagPage(req);

      SuccessResponse(res, StatusCodes.CREATED, 'Create new flag successfully', newFlagPage);
    } catch (error) {
      next(error);
    }
  };
  static getFlagPage = async (req, res, next) => {
    try {
      const flag = await FlagPageService.getOneFlagPage(req);

      SuccessResponse(res, StatusCodes.OK, 'Get flag successfully', flag);
    } catch (error) {
      next(error);
    }
  };
  static getAllFlagPages = async (req, res, next) => {
    try {
      const { metaData, others } = await FlagPageService.getAllFlagPage(req);

      SuccessResponse(res, StatusCodes.OK, 'Get all flag page successfully', metaData, others);
    } catch (error) {
      next(error);
    }
  };

  static updateFlagPage = async (req, res, next) => {
    try {
      const flag = await FlagPageService.updateFlagPage(req);

      SuccessResponse(res, StatusCodes.OK, 'Updated flag page successfully', flag);
    } catch (error) {
      next(error);
    }
  };
  static deleteFlagPage = async (req, res, next) => {
    try {
      await FlagPageService.deleteFlagPage(req);
      SuccessResponse(res, StatusCodes.OK, 'Delete flag page successfully', {});
    } catch (error) {
      next(error);
    }
  };
}
