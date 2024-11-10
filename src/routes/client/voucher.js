import express from 'express';
import { VoucherController } from '../../controllers/voucher.controller.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { objectIdValidation } from '../../validations/objectId.validation.js';
const clientVoucherRouter = express.Router();

clientVoucherRouter.get(
  '/',
  authMiddleware,
  VoucherController.getAllVouchersClient
);

clientVoucherRouter.get(
  '/:id',
  authMiddleware,
  objectIdValidation,
  VoucherController.getOneVoucher
);

export default clientVoucherRouter;
