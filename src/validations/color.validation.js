import { validateBeforeCreateOrUpdate } from '../utils/validators.js';
import Joi from 'joi';

const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;

export const createColorValidation = async (req, res, next) => {
  const createSchema = Joi.object({
    name: Joi.string().trim().required().messages({
      'string.empty': "Color name can't be empty",
      'any.required': 'Color name is required',
    }),
    value: Joi.string().trim().regex(hexColorRegex).required().messages({
      'string.empty': "Color value can't be empty",
      'string.pattern.base': 'Color value must be a valid hex color code',
      'any.required': 'Color value is required',
    }),
  });

  try {
    await validateBeforeCreateOrUpdate(createSchema, req.body);
    next();
  } catch (error) {
    next(error);
  }
};

export const updateColorValidation = async (req, res, next) => {
  const updateSchema = Joi.object({
    name: Joi.string().trim().messages({
      'string.empty': "Color name can't be empty",
    }),
    value: Joi.string().trim().regex(hexColorRegex).messages({
      'string.empty': "Color value can't be empty",
      'string.pattern.base': 'Color value must be a valid hex color code',
    }),
  }).min(1);

  try {
    await validateBeforeCreateOrUpdate(updateSchema, req.body);
    next();
  } catch (error) {
    next(error);
  }
};
