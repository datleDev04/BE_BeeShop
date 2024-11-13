import { ORDER_STATUS } from '../../../../utils/constants.js'

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
