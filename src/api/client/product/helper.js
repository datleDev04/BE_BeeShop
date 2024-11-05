import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;
import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../utils/ApiError.js';
import { cleanObject } from '../../helpers/object.js';
import { removeObjectKeys } from '../../helpers/object.js';
import { getArrayParams } from '../../helpers/api-handler.js';
import { STATUS } from '../../../utils/constants.js';
import {
  BRAND_LOOKUP,
  BRAND_LOOKUP_FIELDS,
  COLOR_LOOKUP,
  COLOR_LOOKUP_FIELDS,
  GENDER_LOOKUP,
  GENDER_LOOKUP_FIELDS,
  PRODUCT_COLOR_LOOKUP,
  PRODUCT_COLOR_LOOKUP_FIELDS,
  PRODUCT_SIZE_LOOKUP,
  PRODUCT_SIZE_LOOKUP_FIELDS,
  PRODUCT_TYPE_LOOKUP,
  PRODUCT_TYPE_LOOKUP_FIELDS,
  SIZE_LOOKUP,
  SIZE_LOOKUP_FIELDS,
  TAG_LOOKUP,
  TAG_LOOKUP_FIELDS,
  VARIANT_LOOKUP,
  VARIANT_LOOKUP_FIELDS,
} from './lookup.js';

export const getProductSearchParams = (params) => {
  const allowKeys = [
    '_page',
    '_limit',
    'tag',
    'label',
    'minPrice',
    'maxPrice',
    'color',
    'size',
    'name',
    'gender',
    'orderBy',
    'sort',
    'brand',
    'slug',
  ];
  for (const key of Object.keys(params)) {
    if (!allowKeys.includes(key))
      throw new ApiError(StatusCodes.BAD_REQUEST, {
        params: `Allow params: ${JSON.stringify(allowKeys).replaceAll('"', '')}`,
      });
  }
  const cleanParams = cleanObject(removeObjectKeys(params, 'include', allowKeys));
  return cleanParams;
};

export const queryBuilder = (params) => {
  const { tag, brand, color, size, label, gender, minPrice, maxPrice, ...filter } = getArrayParams(
    getProductSearchParams(params),
    ['tag', 'brand', 'color', 'size', 'label', 'gender']
  );

  const queryOptions = { status: STATUS.ACTIVE, ...filter };
  let priceOptions = {};
  if (tag)
    queryOptions.tags = {
      $elemMatch: { _id: { $in: tag.map((id) => ObjectId.createFromHexString(id)) } },
    };
  if (brand)
    queryOptions.brand = {
      $elemMatch: { _id: { $in: brand.map((id) => ObjectId.createFromHexString(id)) } },
    };
  if (color)
    queryOptions.product_colors = {
      $elemMatch: {
        _id: { $in: color.map((id) => ObjectId.createFromHexString(id)) },
      },
    };
  if (size)
    queryOptions.product_sizes = {
      $elemMatch: {
        _id: { $in: size.map((id) => ObjectId.createFromHexString(id)) },
      },
    };
  if (label) queryOptions.labels = { $in: label.map((id) => ObjectId.createFromHexString(id)) };
  if (gender)
    queryOptions.gender = {
      $elemMatch: { _id: { $in: gender.map((id) => ObjectId.createFromHexString(id)) } },
    };
  if (minPrice || maxPrice) {
    if (minPrice) priceOptions.$gte = Number(minPrice);
    if (maxPrice) priceOptions.$lte = Number(maxPrice);
  } else priceOptions = null;

  if (priceOptions) {
    queryOptions.variants = {
      $elemMatch: {
        discount_price: priceOptions,
      },
    };
  }

  return queryOptions;
};

export const populateOptions = [
  {
    $lookup: {
      ...VARIANT_LOOKUP,
      pipeline: [
        { $project: VARIANT_LOOKUP_FIELDS },
        { $lookup: { ...COLOR_LOOKUP, pipeline: [{ $project: COLOR_LOOKUP_FIELDS }] } },
        { $unwind: { path: '$color', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            ...SIZE_LOOKUP,
            pipeline: [
              { $project: SIZE_LOOKUP_FIELDS },
              { $lookup: { ...GENDER_LOOKUP, pipeline: [{ $project: GENDER_LOOKUP_FIELDS }] } },
              { $unwind: { path: '$gender', preserveNullAndEmptyArrays: true } },
            ],
          },
        },
        { $unwind: { path: '$size', preserveNullAndEmptyArrays: true } },
      ],
    },
  },
  { $lookup: { ...PRODUCT_COLOR_LOOKUP, pipeline: [{ $project: PRODUCT_COLOR_LOOKUP_FIELDS }] } },
  { $lookup: { ...PRODUCT_SIZE_LOOKUP, pipeline: [{ $project: PRODUCT_SIZE_LOOKUP_FIELDS }] } },
  { $lookup: { ...TAG_LOOKUP, pipeline: [{ $project: TAG_LOOKUP_FIELDS }] } },
  { $lookup: { ...GENDER_LOOKUP, pipeline: [{ $project: GENDER_LOOKUP_FIELDS }] } },
  { $unwind: { path: '$gender', preserveNullAndEmptyArrays: true } },
  { $lookup: { ...PRODUCT_TYPE_LOOKUP, pipeline: [{ $project: PRODUCT_TYPE_LOOKUP_FIELDS }] } },
  { $unwind: { path: '$product_type', preserveNullAndEmptyArrays: true } },
  { $lookup: { ...BRAND_LOOKUP, pipeline: [{ $project: BRAND_LOOKUP_FIELDS }] } },
  { $unwind: { path: '$brand', preserveNullAndEmptyArrays: true } },
];
