import Joi from 'joi';
import { validateBeforeCreateOrUpdate } from '../utils/validators.js';

export const shippingMethodValidation = async (req, res, next) => {
  const correctCondition = Joi.object({
    name: Joi.string().required().messages({
      'string.empty': 'Tên phương thức vận chuyển không được để trống',
      'any.required': 'Tên phương thức vận chuyển là bắt buộc',
    }),
    cost: Joi.number().positive().required().messages({
      'number.base': 'Chi phí phải là một số',
      'number.positive': 'Chi phí phải là một số dương',
      'any.required': 'Chi phí là bắt buộc',
    }),
    estimated_delivery_time: Joi.string().required().messages({
      'string.empty': 'Thời gian giao hàng dự kiến không được để trống',
      'any.required': 'Thời gian giao hàng dự kiến là bắt buộc',
    }),
  });

  try {
    await validateBeforeCreateOrUpdate(correctCondition, req.body);
    next();
  } catch (error) {
    next(error);
  }
};
