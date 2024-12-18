import Joi from 'joi';
import {
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE,
  validateBeforeCreateOrUpdate,
} from '../utils/validators.js';
import { ORDER_STATUS, PAYMENT_STATUS, PAYMENT_TYPE } from '../utils/constants.js';

export const orderValidation = async (req, res, next) => {
  const correctCondition = Joi.object({
    items: Joi.array()
      .items(
        Joi.object({
          product_id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
          variant_id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
          quantity: Joi.number().min(1).required(),
        })
      )
      .min(1)
      .required(),
    total_price: Joi.number().min(0).required().messages({
      'number.base': 'Total price must be a number',
      'number.min': 'Total price must be a positive value',
    }),
    regular_total_price: Joi.number().min(0).optional(),
    discount_price: Joi.number().min(0).optional(),
    shipping_address: Joi.string().required().messages({
      'string.empty': 'Shipping address is required',
    }),
    phone_number: Joi.string().required().messages({
      'string.empty': 'Phone number is required',
    }),
    voucher: Joi.string()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE)
      .allow(null)
      .optional(),
    user_name: Joi.string().required().messages({
      'string.empty': 'User name is required',
    }),
    shipping_fee: Joi.number().min(0).required().messages({
      'number.min': 'Shipping fee must be a positive value or zero',
    }),
    user_email: Joi.string().email().required().messages({
      'string.empty': 'User email is required',
      'string.email': 'User email must be a valid email address',
    }),
    payment_type: Joi.string().valid(PAYMENT_TYPE.PAYOS, PAYMENT_TYPE.VNPAY, PAYMENT_TYPE.COD).required(),
    note: Joi.string().empty('').optional(),
    tracking_number: Joi.string().optional(),
  });

  try {
    await validateBeforeCreateOrUpdate(correctCondition, req.body);
    next();
  } catch (error) {
    next(error);
  }
};

export const updateOrderValidation = async (req, res, next) => {
  const correctCondition = Joi.object({
    shipping_address: Joi.string()
      .required()
      .messages({
        'string.empty': 'Shipping address is required',
      })
      .optional(),
    phone_number: Joi.string()
      .required()
      .messages({
        'string.empty': 'Phone number is required',
      })
      .optional(),
    user_name: Joi.string()
      .required()
      .messages({
        'string.empty': 'User name is required',
      })
      .optional(),
    user_email: Joi.string()
      .email()
      .required()
      .messages({
        'string.empty': 'User email is required',
        'string.email': 'User email must be a valid email address',
      })
      .optional(),
    order_status: Joi.string()
      .valid(...Object.values(ORDER_STATUS))
      .messages({
        'any.only': 'Order status must be a valid enum value',
      })
      .optional(),
    payment_status: Joi.string()
      .valid(...Object.values(PAYMENT_STATUS))
      .messages({
        'any.only': 'Payment status must be a valid enum value',
      })
      .optional(),
    note: Joi.string().optional(),
    tracking_number: Joi.string().optional(),
  });

  try {
    await validateBeforeCreateOrUpdate(correctCondition, req.body);
    next();
  } catch (error) {
    next(error);
  }
};
