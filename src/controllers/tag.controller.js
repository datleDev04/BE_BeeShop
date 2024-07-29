import { StatusCodes } from 'http-status-codes';
import { TagService } from '../services/tag.service.js';
import { SuccessResponse } from '../utils/response.js';

export class TagController {
  static getAllTags = async (req, res, next) => {
    try {
      const { metaData, others } = await TagService.getAllTags(req);

      SuccessResponse(res, StatusCodes.OK, 'Get all tag successfully', metaData, others);
    } catch (error) {
      next(error);
    }
  };

  static getOneTag = async (req, res, next) => {
    try {
      const tag = await TagService.getOneTag(req);

      SuccessResponse(res, StatusCodes.OK, 'Get one tag successfully', tag);
    } catch (error) {
      next(error);
    }
  };

  static createTag = async (req, res, next) => {
    try {
      const newTag = await TagService.createTag(req);
      SuccessResponse(res, StatusCodes.CREATED, 'Create new tag successfully', newTag);
    } catch (error) {
      next(error);
    }
  };

  static updateTagById = async (req, res, next) => {
    try {
      const updatedTag = await TagService.updateTagById(req);

      SuccessResponse(res, StatusCodes.OK, 'Updated tag successfully', updatedTag);
    } catch (error) {
      next(error);
    }
  };

  static deleteTagById = async (req, res, next) => {
    try {
      await TagService.deleteTagById(req);

      SuccessResponse(res, StatusCodes.OK, 'deleted tag successfully', {});
    } catch (error) {
      next(error);
    }
  };
}
