export const PRODUCT_TYPE_LOOKUP = {
  CONFIG: {
    from: 'Product_Types',
    localField: 'product_type',
    foreignField: '_id',
    as: 'product_type',
  },
  FIELDS: {
    id: 1,
    name: 1,
    slug: 1,
  },
};
