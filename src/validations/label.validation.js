import Joi from 'joi';
import { validateBeforeCreateOrUpdate } from '../utils/validators.js';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/ApiError.js';

export const createLabelValidation = async (req, res, next) => {
  const correctCondition = Joi.object({
    name: Joi.string().trim().required(),
    description: Joi.string().allow('').trim(),
  });

  try {
    await validateBeforeCreateOrUpdate(correctCondition, req.body);
    next();
  } catch (error) {
    next(error);
  }
};
export const updateLabelValidation = async (req, res, next) => {
  const correctCondition = Joi.object({
    name: Joi.string().trim(),
    description: Joi.string().allow('').trim(),
  });

  try {
    await validateBeforeCreateOrUpdate(correctCondition, req.body);
    next();
  } catch (error) {
    next(error);
  }
};
