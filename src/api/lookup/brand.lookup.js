export const BRAND_LOOKUP = {
  CONFIG: {
    from: 'Brands',
    localField: 'brand',
    foreignField: '_id',
    as: 'brand',
  },
  FIELDS: {
    id: 1,
    name: 1,
    image: 1,
    description: 1,
    slug: 1,
  },
};
