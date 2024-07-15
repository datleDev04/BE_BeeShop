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
    slug_name: Joi.string().pattern(new RegExp('^[a-z0-9_-]+$')).required(),
    description: Joi.string().min(10).required(),
    regular_price: Joi.number().min(0).required(),
    discount_price: Joi.number().optional(),
    images: Joi.array().items(Joi.string().required()).required(),
    tags: Joi.alternatives()
      .try(
        Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
        Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
      )
      .required(),
    gender: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
    labels: Joi.alternatives()
      .try(
        Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
        Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
      )
      .required(),
    isPublic: Joi.boolean().default(false),
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
      .required(),
    product_sizes: Joi.array()
      .items(
        Joi.object({
          size_id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
        })
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
    slug_name: Joi.string().pattern(new RegExp('^[a-z0-9_-]+$')),
    description: Joi.string().min(10),
    regular_price: Joi.number().min(0),
    discount_price: Joi.number().optional(),
    images: Joi.array().items(Joi.string()),
    tags: Joi.alternatives().try(
      Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
      Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    ),
    gender: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    labels: Joi.alternatives().try(
      Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
      Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    ),
    isPublic: Joi.boolean().default(false),
    brand: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    product_colors: Joi.array().items(
      Joi.object({
        color_id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
        image_url: Joi.string().trim().messages({
          'string.empty': "Product Color image can't be empty",
        }),
      })
    ),
    product_sizes: Joi.array().items(
      Joi.object({
        size_id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
      })
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
