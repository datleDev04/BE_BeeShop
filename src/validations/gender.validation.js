import { validateBeforeCreateOrUpdate } from '../utils/validators.js';
import Joi from 'joi';

export const createGenderValidation = async (req, res, next) => {
  const createSchema = Joi.object({
    name: Joi.string().trim().required().messages({
      'string.empty': "Gender name can't be empty",
      'any.required': 'Gender name is required',
    }),
  });

  try {
    await validateBeforeCreateOrUpdate(createSchema, req.body);
    next();
  } catch (error) {
    next(error);
  }
};

export const updateGenderValidation = async (req, res, next) => {
  const updateSchema = Joi.object({
    name: Joi.string().trim().messages({
      'string.empty': "Gender name can't be empty",
    }),
  });

  try {
    await validateBeforeCreateOrUpdate(updateSchema, req.body);
    next();
  } catch (error) {
    next(error);
  }
};
