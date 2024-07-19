import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/ApiError.js';
import {
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE,
  validateBeforeCreateOrUpdate,
} from '../utils/validators.js';
import Joi from 'joi';

export class userValidation {
  static updateUserInfo = async (req, res, next) => {
    const correctCondition = Joi.object({
      user_name: Joi.string().optional().messages({
        'string.base': 'User name should be a string',
        'string.empty': 'User name cannot be an empty field',
      }),
      password: Joi.string().optional(6).trim().messages({
        'string.base': 'Password should be a string',
        'string.email': 'Password should be a valid password address',
      }),
      avatar_url: Joi.string().optional().uri().messages({
        'string.base': 'Avatar URL should be a string',
        'string.uri': 'Avatar URL should be a valid URI',
      }),
      email: Joi.string().optional().email().messages({
        'string.base': 'Email should be a string',
        'string.email': 'Email should be a valid email address',
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
    });

    try {
      await validateBeforeCreateOrUpdate(correctCondition, req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
}
