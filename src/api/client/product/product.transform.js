import lodash from 'lodash';
import { toCamelCase } from '../../helpers/transform.js';

export const TransformProduct = (products, transform) => {
  if (Array.isArray(products)) {
    return products.map((product) => transform(product));
  }

  return transform(products);
};

export const listTransform = (product) => {
  const data = product._doc || product;
  const excludeKeys = [
    // 'updatedAt',
    // 'description',
    // 'sort_description',
    // 'images',
    // 'product_colors',
    // 'product_sizes',
  ];

  const lowestDiscountPriceVariant = lodash.minBy(data.variants, 'discount_price');
  const highestDiscountPriceVariant = lodash.maxBy(data.variants, 'discount_price');

  return {
    ...toCamelCase(lodash.omit(data, ...excludeKeys)),
    minPrice: lowestDiscountPriceVariant?.discount_price,
    maxPrice: highestDiscountPriceVariant?.discount_price,
  };
};

export const detailTransform = (product) => {
  const data = product._doc || product;
  const excludeKeys = [];

  const lowestDiscountPriceVariant = lodash.minBy(data.variants, 'discount_price');
  const highestDiscountPriceVariant = lodash.maxBy(data.variants, 'discount_price');

  return {
    ...toCamelCase(lodash.omit(data, ...excludeKeys)),
    minPrice: lowestDiscountPriceVariant?.discount_price,
    maxPrice: highestDiscountPriceVariant?.discount_price,
  };
};
