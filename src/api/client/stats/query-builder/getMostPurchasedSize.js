import { TIME_FILTER } from '../../../helpers/constants.js';
import { getDateRangeWithDateFns } from '../../../helpers/date.js';
import { VARIANT_LOOKUP } from '../../../lookup/variant.lookup.js';
import { SIZE_LOOKUP } from '../../../lookup/size.lookup.js';
import { GENDER_LOOKUP } from '../../../lookup/gender.lookup.js';

export const GET_MOST_PURCHASED_SIZE = {
  getPopulateOptions: () => [
    {
      $lookup: {
        ...VARIANT_LOOKUP.CONFIG,
        localField: 'variant',
        as: 'variant',
        pipeline: [
          {
            $lookup: {
              ...SIZE_LOOKUP.CONFIG,
              pipeline: [
                {
                  $lookup: {
                    ...GENDER_LOOKUP.CONFIG,
                    pipeline: [{ $project: GENDER_LOOKUP.FIELDS }],
                  },
                },
                { $unwind: '$gender' },
              ],
            },
          },
          { $unwind: '$size' },
        ],
      },
    },
    { $unwind: '$variant' },
    {
      $group: {
        _id: '$variant.size._id',
        name: { $first: '$variant.size.name' },
        gender: { $first: '$variant.size.gender' },
        total: { $sum: 1 },
      },
    },
  ],
};
