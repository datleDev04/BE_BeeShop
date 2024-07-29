import {
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE,
  validateBeforeCreateOrUpdate,
} from '../utils/validators.js';
import Joi from 'joi';

export const objectIdValidation = async (req, res, next) => {
  const correctCondition = Joi.object({
    id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  });

  try {
    await validateBeforeCreateOrUpdate(correctCondition, req.params);
    next();
  } catch (error) {
    next(error);
  }
};
