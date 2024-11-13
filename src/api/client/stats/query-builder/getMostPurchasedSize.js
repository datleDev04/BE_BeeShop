import { COLOR_LOOKUP } from '../../../lookup/color.lookup.js';
import { SIZE_LOOKUP } from '../../../lookup/size.lookup.js';

export const GET_MOST_PURCHASED_SIZE = {
  getPopulateOptions: () => [
    { $unwind: '$variant' },
    {
      $lookup: {
        from: 'Variants',
        localField: 'variant',
        foreignField: '_id',
        as: 'variant',
        pipeline: [
          { $lookup: { ...SIZE_LOOKUP.CONFIG } },
          { $unwind: '$size' },
          { $lookup: { ...COLOR_LOOKUP.CONFIG } },
          { $unwind: '$color' },
        ],
      },
    },
    {
      $group: {
        _id: '$variant.size._id',
        quantity: { $first: '$quantity' },
        size: { $first: '$variant.size.name' },
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ],
};
