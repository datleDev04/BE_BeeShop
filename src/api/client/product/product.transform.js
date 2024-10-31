import lodash from 'lodash';
import { toCamelCase } from '../../helpers/transform.js';

const excludeKeys = ['updatedAt', 'description', 'sort_description', 'images', 'product_colors', 'product_sizes', 'variants'];

const transform = (product) => {
  const data = product._doc || product;
  
  const lowestDiscountPriceVariant = lodash.minBy(data.variants, 'discount_price')
  const highestDiscountPriceVariant = lodash.maxBy(data.variants, 'discount_price')

  return {
    minPrice: lowestDiscountPriceVariant?.discount_price,
    maxPrice: highestDiscountPriceVariant?.discount_price,
    ...toCamelCase(lodash.omit(data, ...excludeKeys))
  };
};

export const TransformProduct = (products) => {
  if (Array.isArray(products)) {
    return products.map((product) => transform(product));
  }

  return transform(products);
};
