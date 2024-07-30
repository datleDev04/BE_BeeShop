import { validateBeforeCreateOrUpdate } from '../utils/validators.js';
import Joi from 'joi';

export const createFlagPageValidation = async (req, res, next) => {
  const correctCondition = Joi.object({
    name: Joi.string().trim().required().messages({
      'string.empty': "Flag page can't be empty",
      'any.required': 'Flag page is required',
    }),
  });

  try {
    await validateBeforeCreateOrUpdate(correctCondition, req.body);
    next();
  } catch (error) {
    next(error);
  }
};
export const updateFlagPageValidation = async (req, res, next) => {
  const correctCondition = Joi.object({
    name: Joi.string().trim().messages({
      'string.empty': "Flag page can't be empty",
      'any.required': 'Flag page is required',
    }),
  });

  try {
    await validateBeforeCreateOrUpdate(correctCondition, req.body);
    next();
  } catch (error) {
    next(error);
  }
};
