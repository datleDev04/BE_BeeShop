import Joi from 'joi';
import { validateBeforeCreateOrUpdate } from '../utils/validators.js';

export const voucherTypeValidation = async (req, res, next) => {
  const correctCondition = Joi.object({
    name: Joi.string().trim().required().messages({
      'string.empty': "Voucher type name can't be empty",
      'any.required': "Voucher type name can't be empty",
    }),
  });

  try {
    await validateBeforeCreateOrUpdate(correctCondition, req.body);
    next();
  } catch (error) {
    next(error);
  }
};
