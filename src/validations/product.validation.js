import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/ApiError.js';
import {
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE,
  validateBeforeCreateOrUpdate,
} from '../utils/validators.js';
import Joi from 'joi';

export const createProductValidation = async (req, res, next) => {
  const correctCondition = Joi.object({
    name: Joi.string().min(3).max(20).trim().required(),
    description: Joi.string().min(10).required(),
    regular_price: Joi.number().min(0).required(),
    discount_price: Joi.number().optional(),
    images: Joi.array().items(Joi.string().required()).required(),
    tags: Joi.alternatives()
      .try(
        Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
        Joi.array()
          .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
          .min(1)
      )
      .required(),
    gender: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
    labels: Joi.alternatives()
      .try(
        Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
        Joi.array()
          .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
          .min(1)
      )
      .required(),
    is_public: Joi.boolean().default(false),
    brand: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
    product_colors: Joi.array()
      .items(
        Joi.object({
          color_id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
          image_url: Joi.string().trim().messages({
            'string.empty': "Product Color image can't be empty",
          }),
        })
      )
      .min(1)
      .required(),
    product_sizes: Joi.alternatives()
      .try(
        Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
        Joi.array()
          .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
          .min(1)
      )
      .required(),
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
    name: Joi.string().min(3).max(20).trim(),
    description: Joi.string().min(10),
    regular_price: Joi.number().min(0),
    discount_price: Joi.number().optional(),
    images: Joi.array().items(Joi.string()),
    tags: Joi.alternatives().try(
      Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
      Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).min(1)
    ),
    gender: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    labels: Joi.alternatives().try(
      Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
      Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).min(1)
    ),
    is_public: Joi.boolean().default(false),
    brand: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    product_colors: Joi.array()
      .items(
        Joi.object({
          color_id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
          image_url: Joi.string().trim().messages({
            'string.empty': "Product Color image can't be empty",
          }),
        })
      )
      .min(1),
    product_sizes: Joi.alternatives().try(
      Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
      Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    ),
    variants: Joi.array().items(
      Joi.object({
        _id: Joi.optional(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)),
        size: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
        color: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
        price: Joi.number(),
        stock: Joi.number(),
      })
    ),
  });

  try {
    await validateBeforeCreateOrUpdate(correctCondition, req.body);
    next();
  } catch (error) {
    const errorMessage = error?.details[0]?.message || new Error(error).message;
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage));
  }
};
