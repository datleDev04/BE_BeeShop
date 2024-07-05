import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/ApiError.js';
import Joi from 'joi';
import {
  validateBeforeCreateOrUpdate,
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE,
} from '../utils/validators.js';

export const voucherValidation = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    code: Joi.string().required(),
    max_usage: Joi.number().required(),
    duration: Joi.number().required(),
    discount: Joi.number().required(),
    discount_types: Joi.string().valid('percentage', 'fixed').required(),
    minimum_order_price: Joi.number(),
    voucher_type: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    start_date: Joi.date(),
    end_date: Joi.date(),
  });

  try {
    await validateBeforeCreateOrUpdate(schema, req.body);
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message));
  }
};

export const objectIdValidation = async (req, res, next) => {
  const schema = Joi.object({
    id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
  });

  try {
    await validateBeforeCreateOrUpdate(schema, req.params);
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message));
  }
};
