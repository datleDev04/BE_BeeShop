import OrderLog from '../models/Order_Log.js';
import { Transformer } from '../utils/transformer.js';

export default class OrderLogService {
  static getLogsByOrderId = async (req, res) => {
    const { id } = req.params;
    const logs = await OrderLog.find({ order: id })
      .sort({ createdAt: -1 })
      .populate([
        {
          path: 'performed_by_user',
          select: '-password -refreshToken -roles -phone -addresses -status -isVerified',
        },
        { path: 'order' },
      ]);
    const transformedLogs = logs.map((log) =>
      Transformer.transformOrderObjectTypeSnakeToCamel(log.toObject())
    );
    return {
      metaData: transformedLogs,
    };
  };
}
