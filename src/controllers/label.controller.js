import { StatusCodes } from 'http-status-codes';
import { SuccessResponse } from '../utils/response.js';
import { Transformer } from '../utils/transformer.js';
import { LabelService } from '../services/label.service.js';

export class LabelController {
  static getAllLabel = async (req, res, next) => {
    try {
      const labels = await LabelService.getAllLabel(req);

      const returnData = labels.map((label) => {
        return Transformer.transformObjectTypeSnakeToCamel(label.toObject());
      });

      SuccessResponse(res, StatusCodes.OK, 'Get all Label successfully', returnData);
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
        Transformer.transformObjectTypeSnakeToCamel(label.toObject())
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
        Transformer.transformObjectTypeSnakeToCamel(newLabel.toObject())
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
        Transformer.transformObjectTypeSnakeToCamel(updatedLabel.toObject())
      );
    } catch (error) {
      next(error);
    }
  };

  static deleteLabelById = async (req, res, next) => {
    await LabelService.deleteLabelBydId(req);

    SuccessResponse(res, StatusCodes.OK, 'delete label successfully', {});
  };
}
