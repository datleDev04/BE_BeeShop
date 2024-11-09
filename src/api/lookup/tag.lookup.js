export const TAG_LOOKUP = {
  CONFIG: {
    from: 'Tags',
    localField: 'tags',
    foreignField: '_id',
    as: 'tags',
  },
  FIELDS: {
    id: 1,
    name: 1,
    slug: 1,
    image: 1,
    description: 1,
    parentId: 1,
  }
}