import { MAX_LEVEL, SHIPPING_RULES } from './constants.js';

const calculateItemVolumeWeight = (dimensions) => {
  return (
    (dimensions.length * dimensions.width * dimensions.height) /
    SHIPPING_RULES.VOLUME_TO_WEIGHT_RATIO
  );
};

const calculateTotalWeight = (items) => {
  return items.reduce((total, item) => {
    const { dimensions, quantity } = item;
    const volumeWeight = calculateItemVolumeWeight(dimensions);
    const itemWeight = Math.max(dimensions.weight, volumeWeight);
    return total + itemWeight * quantity;
  }, 0);
};

const findShippingLevel = (weight) => {
  const weightLevels = Object.values(SHIPPING_RULES.WEIGHT);
  return weightLevels.find((level) => weight <= level.MAX);
};

const calculateExtraCharge = (weight) => {
  const extraWeight = Math.ceil(weight - MAX_LEVEL.MAX);
  return extraWeight > 0 ? extraWeight * SHIPPING_RULES.EXTRA_CHARGE_PER_KG : 0;
};

export const calculateShippingFee = (items) => {
  if (!items || items.length === 0) {
    return 0;
  }

  const totalWeight = calculateTotalWeight(items);

  const level = findShippingLevel(totalWeight);

  if (level) {
    return level.PRICE;
  }

  return MAX_LEVEL.PRICE + calculateExtraCharge(totalWeight);
};
