import { validateBeforeCreateOrUpdate } from '../utils/validators.js';
import Joi from 'joi';


export const brandValidation = async (req, res, next) => {
  const correctCondition = Joi.object({
    name: Joi.string().trim().required(),
    image: Joi.string().trim().required(),
    description: Joi.string().allow("").trim()
  });

  try {
    await validateBeforeCreateOrUpdate(correctCondition, req.body);
    next();
  } catch (error) {
    next(error);
  }
};
