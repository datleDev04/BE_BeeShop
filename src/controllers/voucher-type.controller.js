import { StatusCodes } from 'http-status-codes';
import RoleService from '../services/role.service.js';
import { Transformer } from '../utils/transformer.js';
import { SuccessResponse } from '../utils/response.js';
import VoucherTypeService from '../services/voucher-type.service.js';

export class VoucherTypeController {
  static getAllVoucherType = async (req, res, next) => {
    try {
      const voucherTypes = await VoucherTypeService.handleGetAllVoucherType(req);

      const returnData = voucherTypes.map((voucherType) => {
        return Transformer.transformObjectTypeSnakeToCamel(voucherType.toObject());
      });

      SuccessResponse(res, StatusCodes.OK, 'Get all voucher types successfully', returnData);
    } catch (error) {
      next(error);
    }
  };

  static getOneVoucherType = async (req, res, next) => {
    try {
      const voucherType = await VoucherTypeService.handleGetOneVoucherType(req);

      SuccessResponse(
        res,
        StatusCodes.OK,
        'Get one voucher type successfully',
        Transformer.transformObjectTypeSnakeToCamel(voucherType.toObject())
      );
    } catch (error) {
      next(error);
    }
  };

  static createNewVoucherType = async (req, res, next) => {
    try {
      const newVoucherTypes = await VoucherTypeService.handleCreateVoucherType(req);

      SuccessResponse(
        res,
        StatusCodes.OK,
        'Create new voucher type successfully',
        Transformer.transformObjectTypeSnakeToCamel(newVoucherTypes.toObject())
      );
    } catch (error) {
      next(error);
    }
  };

  static updateVoucherTypeById = async (req, res, next) => {
    try {
      const updatedVoucherType = await VoucherTypeService.handleUpdateVoucherType(req);

      SuccessResponse(
        res,
        StatusCodes.OK,
        'Updated voucher type successfully',
        Transformer.transformObjectTypeSnakeToCamel(updatedVoucherType.toObject())
      );
    } catch (error) {
      next(error);
    }
  };

  static deleteVoucherTypeById = async (req, res, next) => {
    try {
      await VoucherTypeService.handleDeleteVoucherType(req);

      SuccessResponse(res, StatusCodes.OK, 'Deleted voucher type successfully', []);
    } catch (error) {
      next(error);
    }
  };
}
