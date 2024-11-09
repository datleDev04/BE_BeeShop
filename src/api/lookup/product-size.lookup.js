export const PRODUCT_SIZE_LOOKUP = {
  CONFIG: {
    from: 'Sizes',
    localField: 'product_sizes',
    foreignField: '_id',
    as: 'product_sizes',
  },
  FIELDS: {
    id: 1,
    name: 1,
    gender: 1,
  },
};
