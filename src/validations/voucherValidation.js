import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/ApiError.js';
import Joi from 'joi';
import {
  validateBeforeCreateOrUpdate,
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE,
} from '../utils/validators.js';

const createVoucherSchema = Joi.object({
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

const updateVoucherSchema = Joi.object({
  name: Joi.string(),
  code: Joi.string(),
  max_usage: Joi.number(),
  duration: Joi.number(),
  discount: Joi.number(),
  discount_types: Joi.string().valid('percentage', 'fixed'),
  minimum_order_price: Joi.number(),
  voucher_type: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  start_date: Joi.date(),
  end_date: Joi.date(),
}).min(1);

export const validateVoucherCreation = async (req, res, next) => {
  try {
    await validateBeforeCreateOrUpdate(createVoucherSchema, req.body);
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message));
  }
};

export const validateVoucherUpdate = async (req, res, next) => {
  try {
    await validateBeforeCreateOrUpdate(updateVoucherSchema, req.body);
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message));
  }
};
