import express from 'express';
import { objectIdValidation } from '../validations/objectIdValidation.js';
import { VoucherTypeController } from '../controllers/voucher-type.controller.js';
import { voucherTypeValidation } from '../validations/voucherTypeValidation.js';

const voucherTypeRouter = express.Router();

voucherTypeRouter.get('/', VoucherTypeController.getAllVoucherType);
voucherTypeRouter.get('/:id', objectIdValidation, VoucherTypeController.getOneVoucherType);
voucherTypeRouter.post('/', voucherTypeValidation, VoucherTypeController.createNewVoucherType);
voucherTypeRouter.patch(
  '/:id',
  objectIdValidation,
  voucherTypeValidation,
  VoucherTypeController.updateVoucherTypeById
);
voucherTypeRouter.delete('/:id', objectIdValidation, VoucherTypeController.deleteVoucherTypeById);

export default voucherTypeRouter;
