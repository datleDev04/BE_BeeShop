import { VARIANT_LOOKUP } from '../../../lookup/variant.lookup.js';
import { COLOR_LOOKUP } from '../../../lookup/color.lookup.js'

export const GET_MOST_PURCHASED_COLOR = {
  getPopulateOptions: () => [
    {
      $lookup: {
        ...VARIANT_LOOKUP.CONFIG,
        localField: 'variant',
        as: 'variant',
        pipeline: [
          {
            $lookup: {
              ...COLOR_LOOKUP.CONFIG,
            },
          },
          { $unwind: '$color' },
        ],
      },
    },
    { $unwind: '$variant' },
    {
      $group: {
        _id: '$variant.color._id',
        name: { $first: '$variant.color.name' },
        value: { $first: '$variant.color.value' },
        total: { $sum: 1 },
      },
    },
  ],
};
