import OrderLog from '../models/Order_Log.js';

export const createOrderLog = async ({ order_id, user_id, status, type, write_by }) => {
  return await OrderLog.create({
    order: order_id,
    performed_by_user: user_id,
    log_type: type,
    status,
    write_by,
  });
};
