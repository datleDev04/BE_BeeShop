import Joi from 'joi';
import { validateBeforeCreateOrUpdate } from '../utils/validators.js';

class authValidation {
  static registerValidation = async (req, res, next) => {
    const correctCondition = Joi.object({
      full_name: Joi.string().min(3).max(20).trim().required(),
      email: Joi.string().email().trim().required(),
      password: Joi.string().min(6).trim().required(),
      confirm_password: Joi.string().min(6).valid(Joi.ref('password')).trim().required(),
    });

    try {
      await validateBeforeCreateOrUpdate(correctCondition, req.body);
      next();
    } catch (error) {
      next(error);
    }
  };

  static loginValidation = async (req, res, next) => {
    const correctCondition = Joi.object({
      email: Joi.string().email().trim().required(),
      password: Joi.string().min(6).trim().required(),
    });

    try {
      await validateBeforeCreateOrUpdate(correctCondition, req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
}

export default authValidation;
