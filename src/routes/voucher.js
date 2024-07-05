import express from 'express';
import { voucherValidation, objectIdValidation } from '../validations/voucherValidation.js';
import { VoucherController } from '../controllers/voucher.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { CheckPermission } from '../utils/CheckPermission.js';

const voucherRouter = express.Router();

voucherRouter.get('/', VoucherController.getAllVouchers);

voucherRouter.get('/:id', objectIdValidation, VoucherController.getOneVoucher);

voucherRouter.post(
  '/',
  voucherValidation,
  authMiddleware,
  CheckPermission('Create_Voucher'),
  VoucherController.createVoucher
);

voucherRouter.patch(
  '/:id',
  voucherValidation,
  authMiddleware,
  CheckPermission('Update_Voucher'),
  objectIdValidation,
  VoucherController.updateVoucher
);

voucherRouter.delete(
  '/:id',
  objectIdValidation,
  authMiddleware,
  CheckPermission('Delete_Voucher'),
  VoucherController.deleteVoucher
);

export default voucherRouter;
