import {
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE,
  validateBeforeCreateOrUpdate,
} from '../utils/validators.js';
import Joi from 'joi';

export const sizeValidation = async (req, res, next) => {
  const correctCondition = Joi.object({
    name: Joi.string().trim().required().messages({
      'string.empty': "Size name can't be empty",
      'any.required': 'Size name is required',
    }),
    gender: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  });

  try {
    await validateBeforeCreateOrUpdate(correctCondition, req.body);
    next();
  } catch (error) {
    next(error);
  }
};

export const updateSizeValidation = async (req, res, next) => {
  const correctCondition = Joi.object({
    name: Joi.optional(
      Joi.string().trim().messages({
        'string.empty': "Size name can't be empty",
      })
    ),
    gender: Joi.optional(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)),
  });

  try {
    await validateBeforeCreateOrUpdate(correctCondition, req.body);
    next();
  } catch (error) {
    next(error);
  }
};
