import { toCamelCase } from '../../helpers/transform.js';

export const mostPurchasedSizeTransform = (originData) => {
  const { _id, quantity = 1, size, count = 1 } = originData._doc || originData;

  return {
    ...toCamelCase({ id: _id.at(0), name: size.at(0), total: quantity * count }),
  };
};

export const mostPurchasedColorTransform = (originData) => {
  const { _id, quantity = 1, color, count = 1 } = originData._doc || originData;

  return {
    ...toCamelCase({ id: _id.at(0), name: color.at(0), total: quantity * count }),
  };
};

export const mostOrdersTransform = (originData) => {
  const { user, count = 0 } = originData._doc || originData;

  return {
    ...toCamelCase({ ...user, totalOrder: count }),
  };
};
