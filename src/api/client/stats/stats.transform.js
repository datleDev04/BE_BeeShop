import { toCamelCase } from '../../helpers/transform.js';
import { filterObjectKeys } from '../../helpers/object.js';

export const mostPurchasedSizeTransform = (originData) => {
  const data = originData._doc || originData;

  return {
    ...toCamelCase(data),
  };
};

export const mostPurchasedColorTransform = (originData) => {
  const data = originData._doc || originData;

  return {
    ...toCamelCase(data),
  };
};

export const mostOrdersTransform = (originData) => {
  const { user, count = 0 } = originData._doc || originData;
  const excludeKeys = ['password', 'resetPasswordToken', 'verificationTokenExpiresAt', 'deleted'];

  return {
    ...toCamelCase({ ...filterObjectKeys(user, 'exclude', excludeKeys), totalOrder: count }),
  };
};
