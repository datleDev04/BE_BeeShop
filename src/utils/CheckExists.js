import { StatusCodes } from "http-status-codes";
import ApiError from "./ApiError.js";

export const checkRecordByField = async (model, field, value, wantExists = false) => {
  try {
    const record = await model.findOne({ [field]: value });

    if (field === '_id') field ='id'
    if (record) {
      if (!wantExists) {
        throw new ApiError(StatusCodes.CONFLICT, { [field]: `Record with ${field}: ${value} already exists` });
      }
    }

    if (record === null && wantExists) {
      throw new ApiError(StatusCodes.NOT_FOUND, { [field]: `Record with ${field}: ${value} not found` });
    }
  } catch (error) {
    throw error;
  }
};