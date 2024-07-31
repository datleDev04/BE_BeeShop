import { StatusCodes } from 'http-status-codes';
import ApiError from './ApiError.js';

export const checkRecordByField = async (
  model,
  field,
  value,
  wantExists = false,
  currentId = null
) => {
  try {
    const query = { [field]: value };
    if (currentId) {
      query._id = { $ne: currentId };
    }

    const record = await model.findOne(query);

    if (field === '_id') field = 'id';
    if (record) {
      if (!wantExists) {
        throw new ApiError(StatusCodes.CONFLICT, {
          [field]: `Record with ${field}: ${value} already exists`,
        });
      }
    }

    if (record === null && wantExists) {
      throw new ApiError(StatusCodes.NOT_FOUND, {
        [field]: `Record with ${field}: ${value} not found`,
      });
    }
  } catch (error) {
    throw error;
  }
};
