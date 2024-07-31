import { validateBeforeCreateOrUpdate } from '../utils/validators.js';
import Joi from 'joi';

export const createProductTypeValidation = async (req, res, next) => {
  const createSchema = Joi.object({
    name: Joi.string().trim().required().messages({
      'string.empty': "Product type name can't be empty",
      'any.required': 'Product type name is required',
    }),
  });

  try {
    await validateBeforeCreateOrUpdate(createSchema, req.body);
    next();
  } catch (error) {
    next(error);
  }
};

export const updateProductTypeValidation = async (req, res, next) => {
  const updateSchema = Joi.object({
    name: Joi.string().trim().messages({
      'string.empty': "Product type name can't be empty",
    }),
  }).min(1);
  try {
    await validateBeforeCreateOrUpdate(updateSchema, req.body);
    next();
  } catch (error) {
    next(error);
  }
};
