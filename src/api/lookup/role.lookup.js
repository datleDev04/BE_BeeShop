export const ROLE_LOOKUP = {
  CONFIG: {
    from: 'Roles',
    localField: 'roles',
    foreignField: '_id',
    as: 'roles',
  },
  FIELDS: {
    id: 1,
    name: 1,
    permissions: 1,
    createdAt: 1,
    updatedAt: 1,
  },
};
