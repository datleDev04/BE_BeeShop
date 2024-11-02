export const VARIANT_LOOKUP = {
  from: 'Variants',
  localField: 'variants',
  foreignField: '_id',
  as: 'variants',
};

export const VARIANT_LOOKUP_FIELDS = {
  id: 1,
  color: 1,
  stock: 1,
  price: 1,
  discount_price: 1,
  size: 1,
  size: 1,
};

export const COLOR_LOOKUP = {
  from: 'Colors',
  localField: 'color',
  foreignField: '_id',
  as: 'color',
};

export const COLOR_LOOKUP_FIELDS = {
  id: 1,
  name: 1,
  value: 1,
};

export const SIZE_LOOKUP = {
  from: 'Sizes',
  localField: 'size',
  foreignField: '_id',
  as: 'size',
};

export const SIZE_LOOKUP_FIELDS = {
  id: 1,
  name: 1,
  value: 1,
};

export const GENDER_LOOKUP = {
  from: 'Genders',
  localField: 'gender',
  foreignField: '_id',
  as: 'gender',
};

export const GENDER_LOOKUP_FIELDS = {
  id: 1,
  name: 1,
  slug: 1,
  image_url: 1,
  path: 1,
};
