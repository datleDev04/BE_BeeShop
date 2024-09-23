import { validateBeforeCreateOrUpdate } from '../utils/validators.js';
import Joi from 'joi';

export const createBannerValidation = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().trim().required(),
    description: Joi.string().allow(''),
    image_url: Joi.string().trim().required(),
    path: Joi.string().trim().required(),
  });

  try {
    await validateBeforeCreateOrUpdate(correctCondition, req.body);
    next();
  } catch (error) {
    next(error);
  }
};

export const updateBannerValidation = async (req, res, next) => {
  const updateCondition = Joi.object({
    title: Joi.string().trim().optional(),
    description: Joi.string().allow(''),
    image_url: Joi.string().trim().optional(),
    path: Joi.string().trim().optional(),
  });

  try {
    await validateBeforeCreateOrUpdate(updateCondition, req.body);
    next();
  } catch (error) {
    next(error);
  }
};
