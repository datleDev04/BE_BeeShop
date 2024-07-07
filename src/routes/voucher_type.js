import express from 'express';
import { objectIdValidation } from '../validations/objectIdValidation.js';
import { VoucherTypeController } from '../controllers/voucher_type.controller.js';
import { voucherTypeValidation } from '../validations/voucherTypeValidation.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { CheckPermission } from '../utils/CheckPermission.js';

const voucherTypeRouter = express.Router();

voucherTypeRouter.get(
  '/',
  authMiddleware,
  CheckPermission('Read_All_VoucherType'),
  VoucherTypeController.getAllVoucherType
);
voucherTypeRouter.get(
  '/:id',
  authMiddleware,
  CheckPermission('Read_One_VoucherType'),
  objectIdValidation,
  VoucherTypeController.getOneVoucherType
);

voucherTypeRouter.post(
  '/',
  voucherTypeValidation,
  authMiddleware,
  CheckPermission('Create_VoucherType'),
  VoucherTypeController.createNewVoucherType
);
voucherTypeRouter.patch(
  '/:id',
  authMiddleware,
  CheckPermission('Update_VoucherType'),
  objectIdValidation,
  voucherTypeValidation,
  VoucherTypeController.updateVoucherTypeById
);
voucherTypeRouter.delete(
  '/:id',
  objectIdValidation,
  authMiddleware,
  CheckPermission('Delete_VoucherType'),
  VoucherTypeController.deleteVoucherTypeById
);

export default voucherTypeRouter;
