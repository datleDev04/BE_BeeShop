export const ORDER_ITEM_LOOKUP = {
  CONFIG: {
    from: 'Order_Items',
    localField: 'order_item',
    foreignField: '_id',
    as: 'order_item',
  },
  FIELDS: {
    id: 1,
    product: 1,
    quantity: 1,
    price: 1,
    variant: 1,
    has_feedback: 1,
    createdAt: 1,
    updatedAt: 1,
  },
};
