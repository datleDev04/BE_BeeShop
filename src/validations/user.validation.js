import {
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE,
  validateBeforeCreateOrUpdate,
} from '../utils/validators.js';
import Joi from 'joi';

export class userValidation {
  static updateUserInfo = async (req, res, next) => {
    const correctCondition = Joi.object({
      user_name: Joi.string().optional().max(50).messages({
        'string.base': 'User name should be a string',
        'string.empty': 'User name cannot be an empty field',
        'string.max': 'User name should be at most 50 characters long',
      }),
      password: Joi.string().optional().min(6).trim().messages({
        'string.base': 'Password should be a string',
        'string.min': 'Password should be at least 6 characters',
      }),
      avatar_url: Joi.string().optional().uri().messages({
        'string.base': 'Avatar URL should be a string',
        'string.uri': 'Avatar URL should be a valid URI',
      }),
      email: Joi.string().optional().email().messages({
        'string.base': 'Email should be a string',
        'string.email': 'Email should be a valid email address',
      }),
      phone: Joi.string().optional().messages({
        'string.base': 'Phone should be a string',
      }),
      birth_day: Joi.string().optional().messages({
        'string.base': 'Birth day should be a string',
      }),
      status: Joi.string().optional().valid('active', 'inactive', 'pending').messages({
        'any.only': 'Status should be one of [active, inactive, pending]',
      }),
      sex: Joi.string().optional().valid('male', 'female', 'other').messages({
        'any.only': 'Sex should be one of [male, female, other]',
      }),
      roles: Joi.alternatives()
        .try(
          Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
          Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
        )
        .optional(),
      address_list: Joi.alternatives()
        .try(
          Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
          Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
        )
        .optional(),
      vouchers: Joi.alternatives()
        .try(
          Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
          Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
        )
        .optional(),
      tag_list: Joi.alternatives()
        .try(
          Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
          Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
        )
        .optional(),
    });

    try {
      await validateBeforeCreateOrUpdate(correctCondition, req.body);
      next();
    } catch (error) {
      next(error);
    }
  };

  static createUserInfo = async (req, res, next) => {
    const correctCondition = Joi.object({
      user_name: Joi.string().required().max(50).messages({
        'string.base': 'User name should be a string',
        'string.empty': 'User name cannot be an empty field',
        'string.max': 'User name should be at most 50 characters long',
        'any.required': 'User name is required',
      }),
      password: Joi.string().required().min(6).trim().messages({
        'string.base': 'Password should be a string',
        'string.min': 'Password should be at least 6 characters',
        'any.required': 'Password is required',
      }),
      avatar_url: Joi.string().optional().uri().messages({
        'string.base': 'Avatar URL should be a string',
        'string.uri': 'Avatar URL should be a valid URI',
      }),
      email: Joi.string().required().email().messages({
        'string.base': 'Email should be a string',
        'string.email': 'Email should be a valid email address',
        'any.required': 'Email is required',
      }),
      phone: Joi.string().optional().messages({
        'string.base': 'Phone should be a string',
      }),
      birth_day: Joi.string().optional().messages({
        'string.base': 'Birth day should be a string',
      }),
      status: Joi.string().optional().valid('active', 'inactive', 'pending').messages({
        'any.only': 'Status should be one of [active, inactive, pending]',
      }),
      sex: Joi.string().optional().valid('male', 'female', 'other').messages({
        'any.only': 'Sex should be one of [male, female, other]',
      }),
      roles: Joi.alternatives()
        .try(
          Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
          Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
        )
        .optional(),
      address_list: Joi.alternatives()
        .try(
          Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
          Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
        )
        .optional(),
      vouchers: Joi.alternatives()
        .try(
          Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
          Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
        )
        .optional(),
      tag_list: Joi.alternatives()
        .try(
          Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
          Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
        )
        .optional(),
    });

    try {
      await validateBeforeCreateOrUpdate(correctCondition, req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
}
