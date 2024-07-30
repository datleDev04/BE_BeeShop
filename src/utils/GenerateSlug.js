import { slugify } from './Slugify.js';
import { v4 as uuidv4 } from 'uuid';

export const generateSlug = async (Model, name) => {
  let slug = slugify(name);

  const existingSlug = await Model.findOne({ slug });
  if (existingSlug) {
    slug = `${slug}-${uuidv4()}`;
  }
  return slug;
};
