// Libs import
import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;
import { StatusCodes } from 'http-status-codes';

// Utils import
import ApiError from '../../../../utils/ApiError.js';
import { STATUS } from '../../../../utils/constants.js';
import { cleanObject } from '../../../helpers/object.js';
import { filterObjectKeys } from '../../../helpers/object.js';
import { getArrayParams } from '../../../helpers/api-handler.js';
import {
  BRAND_LOOKUP,
  COLOR_LOOKUP,
  GENDER_LOOKUP,
  PRODUCT_SIZE_LOOKUP,
  PRODUCT_COLOR_LOOKUP,
  PRODUCT_TYPE_LOOKUP,
  SIZE_LOOKUP,
  TAG_LOOKUP,
  VARIANT_LOOKUP,
  LABEL_LOOKUP,
} from '../../../lookup/index.js';

export const GET_ALL_PRODUCT = {
  getPopulateOptions: () => [
    {
      $lookup: {
        ...VARIANT_LOOKUP.CONFIG,
        pipeline: [
          { $project: VARIANT_LOOKUP.FIELDS },
          { $lookup: { ...COLOR_LOOKUP.CONFIG, pipeline: [{ $project: COLOR_LOOKUP.FIELDS }] } },
          { $unwind: { path: '$color', preserveNullAndEmptyArrays: true } },
          {
            $lookup: {
              ...SIZE_LOOKUP.CONFIG,
              pipeline: [
                { $project: SIZE_LOOKUP.FIELDS },
                { $lookup: { ...GENDER_LOOKUP.CONFIG, pipeline: [{ $project: GENDER_LOOKUP.FIELDS }] } },
                { $unwind: { path: '$gender', preserveNullAndEmptyArrays: true } },
              ],
            },
          },
          { $unwind: { path: '$size', preserveNullAndEmptyArrays: true } },
        ],
      },
    },
    { $lookup: { ...PRODUCT_COLOR_LOOKUP.CONFIG, pipeline: [{ $project: PRODUCT_COLOR_LOOKUP.FIELDS }] } },
    { $lookup: { ...PRODUCT_SIZE_LOOKUP.CONFIG, pipeline: [{ $project: PRODUCT_SIZE_LOOKUP.FIELDS }] } },
    { $lookup: { ...LABEL_LOOKUP.CONFIG} },
    { $lookup: { ...TAG_LOOKUP.CONFIG, pipeline: [{ $project: TAG_LOOKUP.FIELDS }] } },
    { $lookup: { ...GENDER_LOOKUP.CONFIG, pipeline: [{ $project: GENDER_LOOKUP.FIELDS }] } },
    { $unwind: { path: '$gender', preserveNullAndEmptyArrays: true } },
    { $lookup: { ...PRODUCT_TYPE_LOOKUP.CONFIG, pipeline: [{ $project: PRODUCT_TYPE_LOOKUP.FIELDS }] } },
    { $unwind: { path: '$product_type', preserveNullAndEmptyArrays: true } },
    { $lookup: { ...BRAND_LOOKUP.CONFIG, pipeline: [{ $project: BRAND_LOOKUP.FIELDS }] } },
    { $unwind: { path: '$brand', preserveNullAndEmptyArrays: true } },
  ],
  getParams(params) {
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
    const cleanParams = cleanObject(filterObjectKeys(params, 'include', allowKeys));
    return cleanParams;
  },
  getQueries(params) {
    const { tag, brand, color, size, label, gender, minPrice, maxPrice, ...filter } = getArrayParams(
      this.getParams(params),
      ['tag', 'brand', 'color', 'size', 'label', 'gender']
    );
  
    const queryOptions = { status: STATUS.ACTIVE, ...filter };
    let priceOptions = {};
    if (tag)
      queryOptions.tags = {
        $elemMatch: { _id: { $in: tag.map((id) => ObjectId.createFromHexString(id)) } },
      };
    if (brand)
      queryOptions['brand._id'] = { $in: brand.map((id) => ObjectId.createFromHexString(id)) }
    if (color)
      queryOptions.variants = {
        $elemMatch: {
          'color._id': { $in: color.map((id) => ObjectId.createFromHexString(id)) },
        },
      };
    if (size)
      queryOptions.product_sizes = {
        $elemMatch: {
          _id: { $in: size.map((id) => ObjectId.createFromHexString(id)) },
        },
      };
    if (label) queryOptions.labels = {
      $elemMatch: {
        _id: { $in: label.map((id) => ObjectId.createFromHexString(id)) }
      }
    };
    if (gender)
      queryOptions['gender._id'] = { $in: gender.map((id) => ObjectId.createFromHexString(id)) }
    if (minPrice || maxPrice) {
      if (minPrice) priceOptions.$gte = Number(minPrice);
      if (maxPrice) priceOptions.$lte = Number(maxPrice);
    } else priceOptions = null;
  
    if (priceOptions) {
      queryOptions.variants = {
        $elemMatch: {
          ...queryOptions.variants?.$elemMatch ,
          discount_price: priceOptions,
        },
      };
    }
  
    return queryOptions;
  },
}