import { StatusCodes } from 'http-status-codes';
import ApiError from '../../utils/ApiError.js';

export const getSortOptions = (orderBy = 'createdAt', sort = 'DESC') => {
  const validSortDirections = ['ASC', 'DESC'];
  const normalizedSort = sort.toUpperCase();

  if (!validSortDirections.includes(normalizedSort)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, {
      params: 'Sort must be either ASC or DESC',
    });
  }

  const sortValue = normalizedSort === 'ASC' ? 1 : -1;

  return { [orderBy]: sortValue };
};

export const getArrayParams = (obj, keys = []) => {
  const output = {};

  for (const [key, value] of Object.entries(obj)) {
    if (keys.includes(key)) {
      if (value) output[key] = value.split(',');
    } else {
      output[key] = value
    }
  }

  return output;
};
