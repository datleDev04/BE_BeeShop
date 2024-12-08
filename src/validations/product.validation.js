import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/ApiError.js';
import {
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE,
  validateBeforeCreateOrUpdate,
} from '../utils/validators.js';
import Joi from 'joi';
import { FLAG_PAGE, STATUS } from '../utils/constants.js';

export const createProductValidation = async (req, res, next) => {
  const correctCondition = Joi.object({
    name: Joi.string().required().trim(),
    sort_description: Joi.string().required(),
    description: Joi.string().required(),
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
          discount_price: Joi.number().min(0),
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
    dimensions: Joi.object({
      weight: Joi.number().min(0).required(),
      length: Joi.number().min(0).required(),
      width: Joi.number().min(0).required(),
      height: Joi.number().min(0).required(),
    }).required(),
    flag: Joi.string()
      .valid(FLAG_PAGE.ALLPAGE, FLAG_PAGE.HOMEPAGE, FLAG_PAGE.SHOPPAGE)
      .default(FLAG_PAGE.ALLPAGE),
    status: Joi.number().valid(STATUS.ACTIVE, STATUS.INACTIVE).default(STATUS.ACTIVE),
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
    sort_description: Joi.string(),
    description: Joi.string(),
    thumbnail: Joi.string(),
    images: Joi.array().items(Joi.string().trim()).min(1),
    tags: Joi.array()
      .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
      .min(1),
    gender: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    enable_delete: Joi.boolean(),
    variants: Joi.array()
      .items(
        Joi.object({
          id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
          size: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
          color: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
          price: Joi.number().required(),
          discount_price: Joi.number().min(0),
          stock: Joi.number().required(),
          enable_delete: Joi.boolean(),
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
    dimensions: Joi.object({
      weight: Joi.number().min(0),
      length: Joi.number().min(0),
      width: Joi.number().min(0),
      height: Joi.number().min(0),
    }),
    flag: Joi.string()
      .valid(FLAG_PAGE.ALLPAGE, FLAG_PAGE.HOMEPAGE, FLAG_PAGE.SHOPPAGE)
      .default(FLAG_PAGE.ALLPAGE),
    status: Joi.number().valid(STATUS.ACTIVE, STATUS.INACTIVE).default(STATUS.ACTIVE),
  });

  try {
    await validateBeforeCreateOrUpdate(correctCondition, req.body);
    next();
  } catch (error) {
    const errorMessage = error?.details[0]?.message || new Error(error).message;
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage));
  }
};
