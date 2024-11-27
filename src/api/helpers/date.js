import {
  startOfWeek,
  endOfWeek,
  subWeeks,
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfYear,
  endOfYear,
  subYears,
  subDays,
  startOfDay,
  endOfDay,
  subHours,
  addHours,
} from 'date-fns';
import { TIME_FILTER } from './constants.js';
import ApiError from '../../utils/ApiError.js';
import { StatusCodes } from 'http-status-codes';

export const getDateRangeWithDateFns = (filter) => {
  const now = new Date();

  let start, end;
  switch (filter) {
    case TIME_FILTER.TODAY: {
      (start = startOfDay(now)), (end = endOfDay(now));
      break;
    }

    case TIME_FILTER.YESTERDAY: {
      const yesterday = subDays(now, 1);
      {
        (start = startOfDay(yesterday)), (end = endOfDay(yesterday));
        break;
      }
    }

    case TIME_FILTER.THIS_WEEK: {
      (start = startOfWeek(now, { weekStartsOn: 1 })), // 1 = Monday
        (end = now);
      break;
    }

    case TIME_FILTER.LAST_WEEK: {
      const lastWeek = subWeeks(now, 1);
      {
        (start = startOfWeek(lastWeek, { weekStartsOn: 1 })),
          (end = endOfWeek(lastWeek, { weekStartsOn: 1 }));
        break;
      }
    }

    case TIME_FILTER.THIS_MONTH: {
      (start = startOfMonth(now)), (end = now);
      break;
    }

    case TIME_FILTER.LAST_MONTH: {
      const lastMonth = subMonths(now, 1);
      {
        (start = startOfMonth(lastMonth)), (end = endOfMonth(lastMonth));
        break;
      }
    }

    case TIME_FILTER.THIS_YEAR: {
      (start = startOfYear(now)), (end = now);
      break;
    }

    case TIME_FILTER.LAST_YEAR: {
      const lastYear = subYears(now, 1);
      {
        (start = startOfYear(lastYear)), (end = endOfYear(lastYear));
        break;
      }
    }

    case TIME_FILTER.ALL_TIME: {
      (start = new Date(0)), (end = now);
      break;
    }

    default: {
      throw new ApiError(StatusCodes.BAD_REQUEST, {
        period: `${filter} is not allow - ${JSON.stringify(Object.values(TIME_FILTER))}`,
      });
    }
  }
  return { start: addHours(start, 7), end: addHours(end, 7) };
};
