import { checkRecordByField } from '../utils/CheckRecord.js';
import Product from '../models/Product.js';
import Variant from '../models/Variant.js';
import OrderItem from '../models/Order_item.js';

export default class OrderItemService {
  static createOrderItem = async (item) => {
    const { product_id, variant_id, quantity } = item;

    // Create order items first
    await checkRecordByField(Product, '_id', product_id, true);
    await checkRecordByField(Variant, '_id', variant_id, true);


    const variant = await Variant.findById({ _id: variant_id });

    const price = variant.discount_price ? variant.discount_price : variant.price;

    const newOrderItem = await OrderItem.create({
      product: product_id,
      variant: variant_id,
      quantity,
      price,
    });

    variant.stock -= quantity;
    await variant.save();

    return newOrderItem;
  };
}
