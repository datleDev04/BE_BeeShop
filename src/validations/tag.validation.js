import Joi from 'joi';
import {
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE,
  validateBeforeCreateOrUpdate,
} from '../utils/validators.js';
import { STATUS } from '../utils/constants.js';

export const createTagValidation = async (req, res, next) => {
  const correctCondition = Joi.object({
    name: Joi.string().trim().required(),
    image: Joi.string().trim().required(),
    description: Joi.string().allow(''),
    parent_id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).allow(null),
  });

  try {
    await validateBeforeCreateOrUpdate(correctCondition, req.body);
    next();
  } catch (error) {
    next(error);
  }
};

export const updateTagValidation = async (req, res, next) => {
  const correctCondition = Joi.object({
    name: Joi.string().trim(),
    image: Joi.string().trim(),
    description: Joi.string().allow(''),
    parent_id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).allow(null),
    status: Joi.number().valid(STATUS.ACTIVE, STATUS.INACTIVE),
  });

  try {
    await validateBeforeCreateOrUpdate(correctCondition, req.body);
    next();
  } catch (error) {
    next(error);
  }
};
