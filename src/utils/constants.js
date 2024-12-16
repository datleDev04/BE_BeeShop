export const STATUS = {
  INACTIVE: 0,
  ACTIVE: 1,
};

export const FLAG_PAGE = {
  ALLPAGE: 'all_page',
  SHOPPAGE: 'shop_page',
  HOMEPAGE: 'home_page',
};

export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  DELEVERING: 'delivering',
  DELIVERED: 'delivered',
  COMPENSATING: 'compensating',
  COMPENSATED: 'compensated',
  SUCCESS: 'success',
  CANCELLED: 'cancelled',
  REQUEST_RETURN: 'request_return',
  DENIED_RETURN: 'denied_return',
  RETURNING: 'returning',
  RETURNED: 'returned',
};

export const ORDER_STATUS_CONVERT = {
  pending: 'Chờ xác nhận',
  processing: 'Chuẩn bị hàng',
  delivering: 'Đang giao hàng',
  delivered: 'Đã giao hàng tới người nhận',
  success: 'Người nhận xác nhận đơn hàng',
  compensating: 'Người bán đang gửi bù hàng',
  compensated: 'Người bán đã gửi bù hàng',
  cancelled: 'Hủy',
  request_return: 'Đang khiếu nại',
  denied_return: 'Từ chối trả hàng',
  returning: 'Đang trả hàng',
  returned: 'Trả hàng thành công',
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
};

export const PAYMENT_TYPE = {
  VNPAY: 'vnpay',
  PAYOS: 'payos',
  COD: 'cod',
};

export const SHIPPING_RULES = {
  WEIGHT: {
    LEVEL_1: { MAX: 500, PRICE: 15000 },
    LEVEL_2: { MAX: 1500, PRICE: 30000 },
    LEVEL_3: { MAX: 5000, PRICE: 50000 },
    LEVEL_4: { MAX: 10000, PRICE: 80000 },
    LEVEL_5: { MAX: 20000, PRICE: 150000 },
    LEVEL_6: { MAX: 30000, PRICE: 200000 },
    LEVEL_7: { MAX: 40000, PRICE: 300000 },
  },
  VOLUME_TO_WEIGHT_RATIO: 6000,
  EXTRA_CHARGE_PER_KG: 10000,
};

export const MAX_LEVEL = SHIPPING_RULES.WEIGHT.LEVEL_7;
