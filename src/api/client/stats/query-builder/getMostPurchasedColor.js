import { COLOR_LOOKUP } from '../../../lookup/color.lookup.js';

export const GET_MOST_PURCHASED_COLOR = {
  getPopulateOptions: () => [
    { $unwind: '$variant' },
    {
      $lookup: {
        from: 'Variants',
        localField: 'variant',
        foreignField: '_id',
        as: 'variant',
        pipeline: [
          { $lookup: { ...COLOR_LOOKUP.CONFIG } },
          { $unwind: '$color' },
        ],
      },
    },
    {
      $group: {
        _id: '$variant.color._id',
        quantity: { $first: '$quantity' },
        color: { $first: '$variant.color.name' },
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ],
};
