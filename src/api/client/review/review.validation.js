import Joi from 'joi';
import {
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE,
  validateBeforeCreateOrUpdate,
} from '../../../utils/validators.js';

export const addReviewValidation = async (req, res, next) => {
  const rules = Joi.object({
    content: Joi.string().required(),
    images: Joi.array().items(Joi.string()).optional(),
    rates: Joi.number().min(1).max(5).required(),
    orderItemId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    reply: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).optional(),
  });

  try {
    await validateBeforeCreateOrUpdate(rules, req.body);
    next();
  } catch (error) {
    next(error);
  }
};
