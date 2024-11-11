import Joi from 'joi';
import {
  validateBeforeCreateOrUpdate,
} from '../utils/validators.js';
import { STATUS } from '../utils/constants.js';
import { VOUCHER_TYPES } from '../models/Voucher.js';

const createVoucherSchema = Joi.object({
  name: Joi.string().required(),
  code: Joi.string().required(),
  max_usage: Joi.number().required(),
  discount: Joi.number().required(),
  discount_types: Joi.string().valid('percentage', 'fixed').required(),
  minimum_order_price: Joi.number(),
  max_reduce: Joi.number(),
  voucher_type: Joi.string().valid(...Object.values(VOUCHER_TYPES)).required(),
  start_date: Joi.date().required(),
  end_date: Joi.date().required(),
});

const updateVoucherSchema = Joi.object({
  name: Joi.string(),
  code: Joi.string(),
  max_usage: Joi.number(),
  discount: Joi.number(),
  status: Joi.number().valid(STATUS.ACTIVE, STATUS.INACTIVE),
  discount_types: Joi.string().valid('percentage', 'fixed'),
  minimum_order_price: Joi.number(),
  max_reduce: Joi.number(),
  voucher_type: Joi.string().valid(...Object.values(VOUCHER_TYPES)),
  start_date: Joi.date(),
  end_date: Joi.date(),
}).min(1);

export const validateVoucherCreation = async (req, res, next) => {
  try {
    await validateBeforeCreateOrUpdate(createVoucherSchema, req.body);
    next();
  } catch (error) {
    next(error);
  }
};

export const validateVoucherUpdate = async (req, res, next) => {
  try {
    await validateBeforeCreateOrUpdate(updateVoucherSchema, req.body);
    next();
  } catch (error) {
    next(error);
  }
};
