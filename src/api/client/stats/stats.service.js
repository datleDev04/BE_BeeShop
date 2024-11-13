import Order_item from '../../../models/Order_item.js';
import { GET_MOST_PURCHASED_COLOR } from './query-builder/getMostPurchasedColor.js'
import { GET_MOST_PURCHASED_SIZE } from './query-builder/getMostPurchasedSize.js';

export const statsService = {
  getMostPurchasedSize: async () => {
    const orders = await Order_item.aggregate([...GET_MOST_PURCHASED_SIZE.getPopulateOptions()]);
    return orders;
  },
  getMostPurchasedColor: async () => {
    const orders = await Order_item.aggregate([...GET_MOST_PURCHASED_COLOR.getPopulateOptions()]);
    return orders;
  },
};
