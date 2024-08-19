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
      throw new ApiError(StatusCodes.BAD_REQUEST, {
        [field]: `Record with ${field}: ${value} not found`,
      });
    }
  } catch (error) {
    throw error;
  }
};

export const checkRecordsByIds = async (Model, ids) => {
  const records = await Model.find({ _id: { $in: ids } }).select('_id');
  const foundIds = new Set(records.map((record) => record._id.toString()));
  for (const id of ids) {
    if (!foundIds.has(id.toString())) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        `Record with _id ${id} not found in ${Model.collection.collectionName}`
      );
    }
  }
};
