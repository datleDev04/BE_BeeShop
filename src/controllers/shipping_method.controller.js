import { StatusCodes } from 'http-status-codes';
import { SuccessResponse } from '../utils/response.js';
import ShippingMethodService from '../services/shipping_method.service.js';

export class ShippingMethodController {
  static createNewShippingMethod = async (req, res, next) => {
    try {
      const newShippingMethod = await ShippingMethodService.createShippingMethod(req);

      SuccessResponse(
        res,
        StatusCodes.CREATED,
        'Create new shipping method successfully',
        newShippingMethod
      );
    } catch (error) {
      next(error);
    }
  };
  static getShippingMethod = async (req, res, next) => {
    try {
      const type = await ShippingMethodService.getOneShippingMethod(req);

      SuccessResponse(res, StatusCodes.OK, 'Get shipping method successfully', type);
    } catch (error) {
      next(error);
    }
  };

  static getAllShippingMethods = async (req, res, next) => {
    try {
      const { metaData, others } = await ShippingMethodService.getAllShippingMethods(req);

      SuccessResponse(
        res,
        StatusCodes.OK,
        'Get All shipping method successfully',
        metaData,
        others
      );
    } catch (error) {
      next(error);
    }
  };

  static updateShippingMethod = async (req, res, next) => {
    try {
      const colors = await ShippingMethodService.updateShippingMethod(req);

      SuccessResponse(res, StatusCodes.OK, 'Updated shipping method successfully', colors);
    } catch (error) {
      next(error);
    }
  };

  static deleteShippingMethod = async (req, res, next) => {
    try {
      await ShippingMethodService.deleteShippingMethod(req);
      SuccessResponse(res, StatusCodes.OK, 'Delete shipping method successfully', {});
    } catch (error) {
      next(error);
    }
  };
}
