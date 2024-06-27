import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError.js";
import { validateBeforeCreateOrUpdate } from "../utils/validators.js";

export const roleValidation = async (req, res, next) => {
    const correctCondition = Joi.object({
        name: Joi.string().trim().required(),
      });
  
      try {
        await validateBeforeCreateOrUpdate(correctCondition, req.body);
        next();
      } catch (error) {
        next(
          new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
        );
      }
}

export const permissionValidation = async (req, res, next) => {
    const correctCondition = Joi.object({
        name: Joi.string().trim().required(),
      });
  
      try {
        await validateBeforeCreateOrUpdate(correctCondition, req.body);
        next();
      } catch (error) {
        next(
          new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
        );
      }
}