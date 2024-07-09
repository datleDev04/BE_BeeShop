import { StatusCodes } from 'http-status-codes';
import { Transformer } from '../utils/transformer.js';
import { SuccessResponse } from '../utils/response.js';
import AddressService from '../services/address.service.js';

export class AddressController {
  static getAllAddress = async (req, res, next) => {
    try {
      const address = await AddressService.getAllAddress(req);

      const returnData = address.map((addressItem) => {
        return Transformer.transformObjectTypeSnakeToCamel(addressItem.toObject());
      });

      SuccessResponse(res, StatusCodes.OK, 'Get all address successfully', returnData);
    } catch (error) {
      next(error);
    }
  };

  static getOneAddress = async (req, res, next) => {
    try {
      const address = await AddressService.getOneAddress(req);

      SuccessResponse(
        res,
        StatusCodes.OK,
        'Get one address successfully',
        Transformer.transformObjectTypeSnakeToCamel(address.toObject())
      );
    } catch (error) {
      next(error);
    }
  };

  static createNewAddress = async (req, res, next) => {
    try {
      const newAddress = await AddressService.createAddress(req);

      SuccessResponse(
        res,
        StatusCodes.OK,
        'Create new address successfully',
        Transformer.transformObjectTypeSnakeToCamel(newAddress.toObject())
      );
    } catch (error) {
      next(error);
    }
  };

  static updateAddressById = async (req, res, next) => {
    try {
      const updatedAddress = await AddressService.updateAddress(req);

      SuccessResponse(
        res,
        StatusCodes.OK,
        'Updated address successfully',
        Transformer.transformObjectTypeSnakeToCamel(updatedAddress.toObject())
      );
    } catch (error) {
      next(error);
    }
  };

  static deleteAddressById = async (req, res, next) => {
    try {
      await AddressService.deleteAddress(req);

      SuccessResponse(res, StatusCodes.OK, 'Deleted address successfully', []);
    } catch (error) {
      next(error);
    }
  };
}
