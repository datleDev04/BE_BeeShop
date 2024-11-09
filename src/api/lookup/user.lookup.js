export const USER_LOOKUP = {
  CONFIG: {
    from: 'Users',
    localField: 'user',
    foreignField: '_id',
    as: 'user',
  },
  FIELDS: {
    id: 1,
    full_name: 1,
    email: 1,
    password: 1,
    status: 1,
    vouchers: 1,
    roles: 1,
    addresses: 1,
    tags: 1,
    deleted: 1,
    createdAt: 1,
    updatedAt: 1,
    avatar_url: 1,
    is_verified: 1,
    resetPasswordToken: 1,
    verificationTokenExpiresAt: 1,
    gender: 1,
    phone: 1,
  },
};
