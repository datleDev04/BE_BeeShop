import { ORDER_STATUS } from '../../../../utils/constants.js';
import { TAG_LOOKUP } from '../../../lookup/tag.lookup.js';

export const GET_MOST_ORDERS = {
  getPopulateOptions: () => [
    {
      $match: {
        order_status: ORDER_STATUS.SUCCESS,
      },
    },
    {
      $lookup: {
        from: 'Users',
        localField: 'user',
        foreignField: '_id',
        as: 'user',
        pipeline: [
          { $lookup: { ...TAG_LOOKUP.CONFIG, pipeline: [{ $project: TAG_LOOKUP.FIELDS }] } },
        ],
      },
    },
    { $unwind: '$user' },
    {
      $group: {
        _id: '$user._id',
        user: { $first: '$user' },
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ],
};
