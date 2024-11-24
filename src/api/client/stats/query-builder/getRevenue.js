import moment from 'moment';
import Order from '../../../../models/Order.js';
import { ORDER_STATUS } from '../../../../utils/constants.js';
const fillMissingDates = (data, type, startDate, endDate) => {
  const filledData = [];
  let current = startDate.clone();

  while (current.isSameOrBefore(endDate)) {
    let dateKey;
    switch (type) {
      case 'day':
        dateKey = current.format('DD');
        break;
      case 'month':
        dateKey = current.format('MM');
        break;
      case 'year':
        dateKey = current.format('YYYY');
        break;
    }

    const existingData = data.find((item) => item.date === dateKey);

    filledData.push({
      date: dateKey,
      totalRevenue: existingData ? existingData.totalRevenue : 0,
      orderCount: existingData ? existingData.orderCount : 0,
    });

    switch (type) {
      case 'day':
        current.add(1, 'day');
        break;
      case 'month':
        current.add(1, 'month');
        break;
      case 'year':
        current.add(1, 'year');
        break;
    }
  }

  return filledData;
};

export const GET_TOTAL_REVENUE = {
  getTotalRevenueOptions: async (type) => {
    let startDate, endDate, groupFormat;
    let pipeline = [];

    switch (type) {
      case 'day':
        startDate = moment().startOf('month');
        endDate = moment().endOf('month');
        groupFormat = '%d';
        break;
      case 'month':
        startDate = moment().startOf('year');
        endDate = moment().endOf('year');
        groupFormat = '%m';
        break;
      case 'year':
        startDate = moment().subtract(2, 'year').startOf('year');
        endDate = moment().endOf('year');
        groupFormat = '%Y';
        break;
      default:
        throw new Error('Invalid statistics type');
    }

    pipeline = [
      {
        $match: {
          createdAt: {
            $gte: startDate.toDate(),
            $lte: endDate.toDate(),
          },
          order_status: ORDER_STATUS.SUCCESS,
        },
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: `${groupFormat}`, date: '$createdAt' } },
          },
          totalRevenue: { $sum: '$total_price' },
          orderCount: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.date': 1 },
      },
      {
        $project: {
          _id: 0,
          date: '$_id.date',
          totalRevenue: 1,
          orderCount: 1,
        },
      },
    ];
    const results = await Order.aggregate(pipeline);

    const filledData = fillMissingDates(results, type, startDate, endDate);
    return filledData;
  },
};
