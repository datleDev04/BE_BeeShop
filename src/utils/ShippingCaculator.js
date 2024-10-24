import { StatusCodes } from 'http-status-codes';
import ApiError from './ApiError.js';
import { SHIPPING_RULES } from './constants.js';

export const calculateOrderShippingFee = async (items) => {
  let totalWeight = 0;
  let totalVolumeWeight = 0;

  items.forEach((item) => {
    const { dimensions, quantity } = item.product;

    totalWeight += dimensions.weight * quantity;

    const volumeWeight =
      dimensions.length *
      dimensions.width *
      dimensions.height *
      SHIPPING_RULES.VOLUME_TO_WEIGHT_RATIO;
    totalVolumeWeight += volumeWeight * quantity;
  });

  const finalWeight = Math.max(totalWeight, totalVolumeWeight);

  if (finalWeight <= SHIPPING_RULES.WEIGHT.LEVEL_1.MAX) {
    return SHIPPING_RULES.WEIGHT.LEVEL_1.PRICE;
  }
  if (finalWeight <= SHIPPING_RULES.WEIGHT.LEVEL_2.MAX) {
    return SHIPPING_RULES.WEIGHT.LEVEL_2.PRICE;
  }
  if (finalWeight <= SHIPPING_RULES.WEIGHT.LEVEL_3.MAX) {
    return SHIPPING_RULES.WEIGHT.LEVEL_3.PRICE;
  }
  if (finalWeight <= SHIPPING_RULES.WEIGHT.LEVEL_4.MAX) {
    return SHIPPING_RULES.WEIGHT.LEVEL_4.PRICE;
  }
  if (finalWeight <= SHIPPING_RULES.WEIGHT.LEVEL_5.MAX) {
    return SHIPPING_RULES.WEIGHT.LEVEL_5.PRICE;
  }
  if (finalWeight <= SHIPPING_RULES.WEIGHT.LEVEL_6.MAX) {
    return SHIPPING_RULES.WEIGHT.LEVEL_6.PRICE;
  }

  throw new ApiError(StatusCodes.BAD_REQUEST, { error: 'Weight exceeds maximum shipping limit' });
};
