import { StatusCodes } from 'http-status-codes';
import { SuccessResponse } from '../utils/response.js';
import { Transformer } from '../utils/transformer.js';
import { LabelService } from '../services/label.service.js';

export class LabelController {
  static getAllLabel = async (req, res, next) => {
    try {
      const { metaData, others } = await LabelService.getAllLabel(req);

      SuccessResponse(res, StatusCodes.OK, 'Get all Label successfully', metaData, others);
    } catch (error) {
      next(error);
    }
  };

  static getOneLabel = async (req, res, next) => {
    try {
      const label = await LabelService.getOneLabel(req);

      SuccessResponse(
        res,
        StatusCodes.OK,
        'Get one label successfully',
        label
      );
    } catch (error) {
      next(error);
    }
  };

  static createLabel = async (req, res, next) => {
    try {
      const newLabel = await LabelService.createLabel(req);
      SuccessResponse(
        res,
        StatusCodes.CREATED,
        'Create new label successfully',
        newLabel
      );
    } catch (error) {
      next(error);
    }
  };

  static updateLabelById = async (req, res, next) => {
    try {
      const updatedLabel = await LabelService.updateLabelById(req);

      SuccessResponse(
        res,
        StatusCodes.OK,
        'Updated label successfully',
        updatedLabel
      );
    } catch (error) {
      next(error);
    }
  };

  static deleteLabelById = async (req, res, next) => {
    try {
      await LabelService.deleteLabelBydId(req);

      SuccessResponse(res, StatusCodes.OK, 'delete label successfully', {});
    } catch (error) {
      next(error);
    }

  };
}
