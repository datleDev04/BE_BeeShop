import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/ApiError.js';
import { validateBeforeCreateOrUpdate } from '../utils/validators.js';
import Joi from 'joi';

export const colorValidation = async (req, res, next) => {
  const correctCondition = Joi.object({
    name: Joi.string().trim().required().messages({
      'string.empty': "Color name can't be empty",
      'any.required': 'Color name is required',
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
