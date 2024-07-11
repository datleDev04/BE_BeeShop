import express from 'express';
import {
  validateVoucherCreation,
  validateVoucherUpdate,
} from '../validations/voucher.validation.js';
import { VoucherController } from '../controllers/voucher.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { CheckPermission } from '../utils/CheckPermission.js';
import { objectIdValidation } from '../validations/objectId.validation.js';

const voucherRouter = express.Router();

voucherRouter.get(
  '/',
  authMiddleware,
  CheckPermission(['Read_Voucher', 'All_Voucher_Permission']),
  VoucherController.getAllVouchers
);

voucherRouter.get(
  '/:id',
  authMiddleware,
  CheckPermission(['Read_Voucher', 'All_Voucher_Permission']),
  objectIdValidation,
  VoucherController.getOneVoucher
);

voucherRouter.post(
  '/',
  validateVoucherCreation,
  authMiddleware,
  CheckPermission(['Create_Voucher', 'All_Voucher_Permission']),
  VoucherController.createVoucher
);

voucherRouter.patch(
  '/:id',
  validateVoucherUpdate,
  authMiddleware,
  CheckPermission(['Update_Voucher', 'All_Voucher_Permission']),
  objectIdValidation,
  VoucherController.updateVoucher
);

voucherRouter.delete(
  '/:id',
  objectIdValidation,
  authMiddleware,
  CheckPermission(['Delete_Voucher', 'All_Voucher_Permission']),
  VoucherController.deleteVoucher
);

export default voucherRouter;
