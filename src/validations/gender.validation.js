import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/ApiError.js';
import { validateBeforeCreateOrUpdate } from '../utils/validators.js';
import Joi from 'joi';

export const genderValidation = async (req, res, next) => {
  const correctCondition = Joi.object({
    name: Joi.string().trim().required().messages({
      'string.empty': "Gender name can't be empty",
      'any.required': 'Gender name is required',
    }),
  });

  try {
    await validateBeforeCreateOrUpdate(correctCondition, req.body);
    next();
  } catch (error) {
    next(error);
  }
};
