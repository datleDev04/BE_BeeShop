import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/ApiError.js';
import {
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE,
  validateBeforeCreateOrUpdate,
} from '../utils/validators.js';
import Joi from 'joi';
import { PRODUCT_STATUS } from '../models/Product.js';

export const createProductValidation = async (req, res, next) => {
  const correctCondition = Joi.object({
    name: Joi.string().required().trim(),
    description: Joi.string().required(),
    regular_price: Joi.number().required().min(0),
    discount_price: Joi.number().min(0),
    thumbnail: Joi.string().required(),
    images: Joi.array().items(Joi.string().trim()).min(1).required(),
    tags: Joi.array()
      .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
      .min(1)
      .required(),
    gender: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
    variants: Joi.array()
      .items(
        Joi.object({
          size: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
          color: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
          price: Joi.number().required(),
          stock: Joi.number().required(),
        })
      )
      .min(1)
      .required(),
    labels: Joi.array()
      .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
      .min(1)
      .max(3)
      .required(),
    brand: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
    product_colors: Joi.array()
      .items(
        Joi.object({
          color_id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
          image_url: Joi.string().trim().required(),
        })
      )
      .min(1)
      .required(),
    product_sizes: Joi.array()
      .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
      .min(1)
      .required(),
    product_type: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
    flag: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    status: Joi.number()
      .valid(PRODUCT_STATUS.ACTIVE, PRODUCT_STATUS.INACTIVE)
      .default(PRODUCT_STATUS.ACTIVE),
  });

  try {
    await validateBeforeCreateOrUpdate(correctCondition, req.body);
    next();
  } catch (error) {
    const errorMessage = error?.details[0]?.message || new Error(error).message;
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage));
  }
};

export const updateProductValidation = async (req, res, next) => {
  const correctCondition = Joi.object({
    name: Joi.string().trim(),
    description: Joi.string(),
    regular_price: Joi.number().min(0),
    discount_price: Joi.number().min(0),
    thumbnail: Joi.string(),
    images: Joi.array().items(Joi.string().trim()).min(1),
    tags: Joi.array()
      .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
      .min(1),
    gender: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    variants: Joi.array()
      .items(
        Joi.object({
          id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
          size: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
          color: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
          price: Joi.number().required(),
          stock: Joi.number().required(),
        })
      )
      .min(1)
      .required(),
    labels: Joi.array()
      .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
      .min(1)
      .max(3),
    brand: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    product_colors: Joi.array()
      .items(
        Joi.object({
          color_id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
          image_url: Joi.string().trim().required(),
        })
      )
      .min(1),
    product_sizes: Joi.array()
      .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
      .min(1),
    product_type: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    flag: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    status: Joi.number()
      .valid(PRODUCT_STATUS.ACTIVE, PRODUCT_STATUS.INACTIVE)
      .default(PRODUCT_STATUS.ACTIVE),
  });

  try {
    await validateBeforeCreateOrUpdate(correctCondition, req.body);
    next();
  } catch (error) {
    const errorMessage = error?.details[0]?.message || new Error(error).message;
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage));
  }
};
