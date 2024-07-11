import express from 'express';
import { AddressController } from '../controllers/address.controller.js';
import {
  addressCreateValidation,
  addressUpdateValidation,
} from '../validations/address.validation.js';
import { objectIdValidation } from '../validations/objectId.validation.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { CheckPermission } from '../utils/CheckPermission.js';

const addressRouter = express.Router();

// get all address
addressRouter.get(
  '/',
  authMiddleware,
  CheckPermission(['Read_Address']),
  AddressController.getAllAddress
);

// get address by id
addressRouter.get(
  '/:id',
  authMiddleware,
  CheckPermission(['Read_Address']),
  objectIdValidation,
  AddressController.getOneAddress
);

// create new address
addressRouter.post(
  '/',
  authMiddleware,
  CheckPermission(['Create_Address']),
  addressCreateValidation,
  AddressController.createNewAddress
);

addressRouter.patch(
  '/:id',
  authMiddleware,
  CheckPermission(['Update_Address']),
  objectIdValidation,
  addressUpdateValidation,
  AddressController.updateAddressById
);

addressRouter.delete(
  '/:id',
  authMiddleware,
  CheckPermission(['Delete_Address']),
  objectIdValidation,
  AddressController.deleteAddressById
);

export default addressRouter;
