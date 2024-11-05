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

export const PRODUCT_COLOR_LOOKUP = {
  from: 'Product_Colors',
  localField: 'product_colors',
  foreignField: '_id',
  as: 'product_colors',
};

export const PRODUCT_COLOR_LOOKUP_FIELDS = {
  id: 1,
  color_id: 1,
  image_url: 1,
};

export const PRODUCT_SIZE_LOOKUP = {
  from: 'Sizes',
  localField: 'product_sizes',
  foreignField: '_id',
  as: 'product_sizes',
};

export const PRODUCT_SIZE_LOOKUP_FIELDS = {
  id: 1,
  name: 1,
  gender: 1,
};

export const TAG_LOOKUP = {
  from: 'Tags',
  localField: 'tags',
  foreignField: '_id',
  as: 'tags',
};

export const TAG_LOOKUP_FIELDS = {
  id: 1,
  name: 1,
  slug: 1,
  image: 1,
  description: 1,
  parentId: 1,
};

export const PRODUCT_TYPE_LOOKUP = {
  from: 'Product_Types',
  localField: 'product_type',
  foreignField: '_id',
  as: 'product_type',
};

export const PRODUCT_TYPE_LOOKUP_FIELDS = {
  id: 1,
  name: 1,
  slug: 1,
};
