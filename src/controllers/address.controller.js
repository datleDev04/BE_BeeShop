import { StatusCodes } from 'http-status-codes';
import { SuccessResponse } from '../utils/response.js';
import AddressService from '../services/address.service.js';

export class AddressController {
  static getAddressesByUserId = async (req, res, next) => {
    try {
      const addresses = await AddressService.getAddressesByUserId(req);

      SuccessResponse(res, StatusCodes.OK, 'Get addresses by user ID successfully', addresses);
    } catch (error) {
      next(error);
    }
  };

  static getAllAddress = async (req, res, next) => {
    try {
      const { metaData, others } = await AddressService.getAllAddress(req);

      SuccessResponse(res, StatusCodes.OK, 'Get all address successfully', metaData, others);
    } catch (error) {
      next(error);
    }
  };

  static getOneAddress = async (req, res, next) => {
    try {
      const address = await AddressService.getOneAddress(req);

      SuccessResponse(res, StatusCodes.OK, 'Get one address successfully', address);
    } catch (error) {
      next(error);
    }
  };

  static createNewAddress = async (req, res, next) => {
    try {
      const newAddress = await AddressService.createAddress(req);

      SuccessResponse(res, StatusCodes.OK, 'Create new address successfully', newAddress);
    } catch (error) {
      next(error);
    }
  };

  static updateAddressById = async (req, res, next) => {
    try {
      const updatedAddress = await AddressService.updateAddress(req);

      SuccessResponse(res, StatusCodes.OK, 'Updated address successfully', updatedAddress);
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
