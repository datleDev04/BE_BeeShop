import express from 'express';
import { AddressController } from '../controllers/address.controller.js';
import { addressValidation } from '../validations/address.validation.js';
import { objectIdValidation } from '../validations/objectId.validation.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { CheckPermission } from '../utils/CheckPermission.js';

const addressRouter = express.Router();

// get all address
addressRouter.get(
  '/',
  authMiddleware,
  CheckPermission(['Read_Address', 'All_Address_Permission']),
  AddressController.getAllAddress
);

// get address by id
addressRouter.get(
  '/:id',
  authMiddleware,
  CheckPermission(['Read_Address', 'All_Address_Permission']),
  objectIdValidation,
  AddressController.getOneAddress
);

// create new address
addressRouter.post(
  '/',
  authMiddleware,
  CheckPermission(['Create_Address', 'All_Address_Permission']),
  addressValidation,
  AddressController.createNewAddress
);

addressRouter.patch(
  '/:id',
  authMiddleware,
  CheckPermission(['Update_Address', 'All_Address_Permission']),
  objectIdValidation,
  addressValidation,
  AddressController.updateAddressById
);

addressRouter.delete(
  '/:id',
  authMiddleware,
  CheckPermission(['Delete_Address', 'All_Address_Permission']),
  objectIdValidation,
  AddressController.deleteAddressById
);

export default addressRouter;
