import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/ApiError.js';
import { validateBeforeCreateOrUpdate } from '../utils/validators.js';
import Joi from 'joi';

export const createBrandValidation = async (req, res, next) => {
  const correctCondition = Joi.object({
    name: Joi.string().trim().required().messages({
      'string.empty': "Brand name can't be empty",
      'any.required': 'Brand name is required',
    }),
    image: Joi.string().trim().messages({
      'string.empty': "Brand image can't be empty",
    }),
    description: Joi.string().trim().messages({
      'string.empty': "Brand description can't be empty",
    }),
  });

  try {
    await validateBeforeCreateOrUpdate(correctCondition, req.body);
    next();
  } catch (error) {
    const errorMessage = error?.details[0]?.message || new Error(error).message;
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage));
  }
};

export const updateBrandValidation = async (req, res, next) => {
  const correctCondition = Joi.object({
    name: Joi.string().trim().messages({
      'string.empty': "Brand name can't be empty",
    }),
    image: Joi.string().trim().messages({
      'string.empty': "Brand image can't be empty",
    }),
    description: Joi.string().trim().messages({
      'string.empty': "Brand description can't be empty",
    }),
  });

  try {
    await validateBeforeCreateOrUpdate(correctCondition, req.body);
    next();
  } catch (error) {
    const errorMessage = error?.details[0]?.message || new Error(error).message;
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage));
  }
};
