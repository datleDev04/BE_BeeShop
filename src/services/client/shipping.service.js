import { calculateShippingFee } from '../../utils/CalculateShippingFee.js';

export default class ShippingClientServive {
  static calculateShippingFee = async (req) => {
    const { items } = req.body;

    const shippingFee = calculateShippingFee(items);

    return { shippingFee };
  };
}
