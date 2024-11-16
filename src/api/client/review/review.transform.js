import { filterObjectKeys } from '../../helpers/object.js';
import { toCamelCase } from '../../helpers/transform.js';

export const reviewTransform = (data) => {
  const product = data.order_item.product;

  const review = {
    ...data,
    product,
    order_item: filterObjectKeys(data.order_item._doc || data.order_item, 'exclude', ['product']),
  };

  return {
    ...toCamelCase(review),
  };
};
