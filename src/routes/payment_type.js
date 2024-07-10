import express from 'express';
import { objectIdValidation } from '../validations/objectId.validation.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { CheckPermission } from '../utils/CheckPermission.js';
import { PaymentTypeController } from '../controllers/payment_type.controller.js';
import { paymentTypeValidation } from '../validations/paymen_type.validation.js';

const paymentTypeRouter = express.Router();

paymentTypeRouter.get(
  '/',
  authMiddleware,
  CheckPermission('Read_PaymentType'),
  PaymentTypeController.getAllPaymentTypes
);
paymentTypeRouter.get(
  '/:id',
  authMiddleware,
  CheckPermission('Read_PaymentType'),
  objectIdValidation,
  PaymentTypeController.getPaymentType
);

// create new paymentType
paymentTypeRouter.post(
  '/',
  authMiddleware,
  CheckPermission('Create_PaymentType'),
  paymentTypeValidation,
  PaymentTypeController.createNewPaymentType
);

// update paymentType by id
paymentTypeRouter.patch(
  '/:id',
  authMiddleware,
  CheckPermission('Update_PaymentType'),
  objectIdValidation,
  paymentTypeValidation,
  PaymentTypeController.updatePaymentType
);

// delete paymentType by id
paymentTypeRouter.delete(
  '/:id',
  authMiddleware,
  CheckPermission('Delete_PaymentType'),
  objectIdValidation,
  PaymentTypeController.deletePaymentType
);

export default paymentTypeRouter;
