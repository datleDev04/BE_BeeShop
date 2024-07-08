import express from 'express';
import { AddressController } from '../controllers/address.controller.js';
import { addressValidation } from '../validations/addressValidation.js';
import { objectIdValidation } from '../validations/objectIdValidation.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { CheckPermission } from '../utils/CheckPermission.js';

const addressRouter = express.Router();

// get all address
addressRouter.get(
  '/',
  authMiddleware,
  CheckPermission("Read_Address"),
  AddressController.getAllAddress
);

// get address by id
addressRouter.get(
  '/:id',
  authMiddleware,
  objectIdValidation,
  AddressController.getOneAddress
);

// create new address 
addressRouter.post(
  '/',
  authMiddleware,
  addressValidation,
  AddressController.createNewAddress
);

addressRouter.patch(
  '/:id',
  authMiddleware,
  objectIdValidation,
  addressValidation,
  AddressController.updateAddressById
);

addressRouter.delete(
  '/:id',
  authMiddleware,
  objectIdValidation, 
  AddressController.deleteAddressById
);

export default addressRouter;
