import { filterObjectKeys } from "../../../helpers/object.js"
import { ORDER_ITEM_LOOKUP, ROLE_LOOKUP, USER_LOOKUP } from "../../../lookup/index.js"

export const GET_PRODUCT_REVIEW = {
  getPopulateOptions: () => [
    {
      $lookup: {
        ...ORDER_ITEM_LOOKUP.CONFIG,
        pipeline: [
          {
            $project: filterObjectKeys(ORDER_ITEM_LOOKUP.FIELDS, 'exclude', [
              'has_feedback',
              'updatedAt',
            ]),
          },
        ],
      },
    },
    {
      $lookup: {
        ...USER_LOOKUP.CONFIG,
        pipeline: [
          {
            $project: filterObjectKeys(USER_LOOKUP.FIELDS, 'include', [
              'id',
              'full_name',
              'email',
              'roles',
              'avatar_url',
              'gender',
            ]),
          },
          {
            $lookup: {
              ...ROLE_LOOKUP.CONFIG,
              pipeline: [
                { $project: filterObjectKeys(ROLE_LOOKUP.FIELDS, 'include', ['id', 'name']) },
              ],
            },
          },
        ],
      },
    },
    { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
    { $unwind: { path: '$order_item', preserveNullAndEmptyArrays: true } },
  ],
};
